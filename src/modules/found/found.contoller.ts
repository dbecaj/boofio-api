import { Body, Controller, Delete, Get, Post, Put, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { IsOwner } from '../../shared/guards/is-owner.guard';
import { ValidatorPipe } from '../../shared/pipes/validator.pipe';
import { Pagination, VPagination } from '../../shared/validators/pagination.validation';
import { IUser } from '../users/entities/user.entity';
import { AuthUser } from '../users/guards/user-auth.guard';
import { DFound } from './dtos/found.dto';
import { IFound } from './entities/found.entity';
import { FoundService } from './found.service';
import { VFoundQuery, VSaveFound, VUpdateFound } from './found.validation';
import { ResolvedFound, ResolveFound } from './guards/found-resolver.guard';

@Controller('v1/found')
export class FoundController {

    constructor(
        private foundService: FoundService,
    ){}

    @Get()
    async getAll(@Query(ValidatorPipe) foundQuery: VFoundQuery, @Pagination() pagination: VPagination) {
        const result = await this.foundService.getAll(foundQuery, pagination);
        return result.map((found) => new DFound(found));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('created')
    async getCreated(@AuthUser() user: IUser, @Pagination() pagination: VPagination) {
        const result = await this.foundService.getCreated(user, pagination);
        return result.map((found) => new DFound(found));
    }

    @ResolveFound()
    @Get(":foundId")
    async get(@ResolvedFound() found: IFound) {
        return new DFound(found);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@AuthUser() user: IUser, @Body(ValidatorPipe) found: VSaveFound) {
        return new DFound(await this.foundService.create(user, found));
    }

    @IsOwner('found', 'userId')
    @ResolveFound()
    @UseGuards(AuthGuard('jwt'))
    @Put(':foundId')
    async update(@ResolvedFound() found: IFound, @Body(ValidatorPipe) updateFound: VUpdateFound) {
        return new DFound(await this.foundService.update(found._id, updateFound));
    }

    @IsOwner('found', 'userId')
    @ResolveFound()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':foundId')
    async delete(@ResolvedFound() found: IFound) {
        return new DFound(await this.foundService.delete(found._id));
    }
}