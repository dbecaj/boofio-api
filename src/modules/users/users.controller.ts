import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { IsOwner } from '../../shared/guards/is-owner.guard';
import { ValidatorPipe } from '../../shared/pipes/validator.pipe';
import { Pagination, VPagination } from '../../shared/validators/pagination.validation';
import { DAuthenticatedUser, DUserTiny } from './dtos/users.dto';
import { IUser } from './entities/user.entity';
import { ResolvedUser, ResolveUser } from './guards/user-resolver.guard';
import { UsersService } from './users.service';
import { VUpdateUser } from './users.validation';

@Controller('v1/users')
export class UsersController {

    constructor(
        private usersService: UsersService,
    ){}

    @UseGuards(AuthGuard('jwt'))
    @Get('recent')
    async getRecentUsers(@Pagination() paginator: VPagination) {
        const result = await this.usersService.getRecentUsers(paginator);
        return result.map((user) => new DUserTiny(user));
    }

    @ResolveUser()
    @Get(':userId')
    async get(@ResolvedUser() user: IUser) {
        return new DAuthenticatedUser(user);
    }

    @IsOwner('resolvedUser', '_id')
    @ResolveUser()
    @UseGuards(AuthGuard('jwt'))
    @Put(':userId')
    async update(@ResolvedUser() user: IUser, @Body(ValidatorPipe) updateUser: VUpdateUser) {
        return this.usersService.update(user._id, user, updateUser);
    }

    @IsOwner('resolvedUser', '_id')
    @ResolveUser()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':userId')
    async delete(@ResolvedUser() user: IUser) {
        return new DAuthenticatedUser(await this.usersService.delete(user._id));
    }
}
