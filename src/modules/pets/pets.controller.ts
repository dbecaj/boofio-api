import { Body, Controller, Delete, Get, Post, Put, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ValidatorPipe } from '../../shared/pipes/validator.pipe';
import { Pagination, VPagination } from '../../shared/validators/pagination.validation';
import { IUser } from '../users/entities/user.entity';
import { AuthUser } from '../users/guards/user-auth.guard';
import { ResolvedUser, ResolveUser } from '../users/guards/user-resolver.guard';
import { DPet } from './dtos/pets.dto';
import { IPet } from './entities/pet.entity';
import { IsPetOwner, ResolvedPet, ResolvePet } from './guards/pet.guard';
import { PetsService } from './pets.service';
import { VPetQuery, VSavePet, VUpdatePet } from './pets.validation';
import { ResolveImage } from '../common/image/image.guard';

@Controller('v1/pets')
export class PetsController {

    constructor(
        private petsService: PetsService,
    ) {
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('created')
    public async getCreated(@AuthUser() user: IUser, @Pagination() pagination: VPagination) {
        const result = await this.petsService.getCreated(user, pagination);
        return result.map((pet) => new DPet(pet));
    }

    @Get()
    public async getAll(@Query(ValidatorPipe) petQuery: VPetQuery, @Pagination() pagination: VPagination) {
        const result = await this.petsService.getAll(petQuery, pagination);
        return result.map((pet) => new DPet(pet));
    }

    @ResolvePet()
    @Get(":petId")
    public async get(@ResolvedPet() pet: IPet) {
        return new DPet(pet);
    }

    @ResolveImage()
    @IsPetOwner()
    @ResolvePet()
    @UseGuards(AuthGuard('jwt'))
    @Put(':petId')
    async update(@ResolvedPet() pet: IPet, @Body(ValidatorPipe) updatePet: VUpdatePet) {
        return new DPet(await this.petsService.update(pet._id, updatePet));
    }

    @IsPetOwner()
    @ResolvePet()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':petId')
    async delete(@ResolvedPet() pet: IPet) {
        return new DPet(await this.petsService.delete(pet));
    }

    @ResolveImage()
    @UseGuards(AuthGuard('jwt'))
    @Post()
    public async create(@AuthUser() user: IUser, @Body(ValidatorPipe) savePet: VSavePet) {
        return new DPet(await this.petsService.create(user, savePet));
    }

    @ResolveUser('body', 'ownerId')
    @IsPetOwner()
    @ResolvePet()
    @UseGuards(AuthGuard('jwt'))
    @Post(':petId/owners')
    public async addOwner(@AuthUser() user: IUser, @ResolvedPet() pet: IPet, @ResolvedUser() newOwner: IUser) {
        return new DPet(await this.petsService.addOwner(user, pet, newOwner._id));
    }

    @ResolveUser('body', 'ownerId')
    @IsPetOwner()
    @ResolvePet()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':petId/owners')
    public async deleteOwner(@ResolvedPet() pet: IPet, @ResolvedUser() author: IUser) {
        return new DPet(await this.petsService.deleteOwner(pet, author._id));
    }
}
