import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { IsOwner } from '../../shared/guards/is-owner.guard';
import { ValidatorPipe } from '../../shared/pipes/validator.pipe';
import { IService } from '../services/entities/service.entity';
import { ResolvedService, ResolveService } from '../services/guards/service-resolver.guard';
import { DAuthenticatedUser, DAuthenticatedUserWithToken } from './dtos/users.dto';
import { IUser } from './entities/user.entity';
import { AuthUser } from './guards/user-auth.guard';
import { UsersService } from './users.service';
import { VUpdateUser } from './users.validation';

@UseGuards(AuthGuard('jwt'))
@Controller('v1/user/profile')
export class ProfileController {

    constructor(
        private userService: UsersService,
    ) {}

    // Return user profile with jwt token
    @Get()
    async getProfile(@Req() req, @AuthUser() user: IUser) {
        // Get Bearer token from header
        const bearer = req.headers['authorization'].split(' ')[1];
        return new DAuthenticatedUserWithToken(bearer, user);
    }

    @IsOwner('user', '_id')
    @Put()
    async updateProfile(@Req() req, @AuthUser() user: IUser, @Body(ValidatorPipe) updateUser: VUpdateUser) {
        return new DAuthenticatedUser(await this.userService.update(user._id, user, updateUser));
    }

    @IsOwner('user', '_id')
    @Delete()
    async deleteProfile(@AuthUser() user: IUser) {
        return new DAuthenticatedUser(await this.userService.delete(user._id));
    }

    @IsOwner('user', '_id')
    @ResolveService('body')
    @Post('bookmarks')
    async addBookmark(@AuthUser() user: IUser, @ResolvedService() service: IService) {
        return new DAuthenticatedUser(await this.userService.addBookmark(user, service._id));
    }

    @IsOwner('user', '_id')
    @ResolveService('body')
    @Delete('bookmarks')
    async deleteBookmark(@AuthUser() user: IUser, @ResolvedService() service: IService) {
        return new DAuthenticatedUser(await this.userService.deleteBookmark(user, service._id));
    }
}