import { Body, Controller, Delete, Get, Post, Put, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ValidatorPipe } from '../../shared/pipes/validator.pipe';
import { Pagination, VPagination } from '../../shared/validators/pagination.validation';
import { DLost } from './dtos/lost.dto';
import { ILost } from './entities/lost.entity';
import { IPet } from './entities/pet.entity';
import { ResolvedLost, ResolveLost } from './guards/lost.guard';
import { IsPetOwner, ResolvedPet, ResolvePet } from './guards/pet.guard';
import { LostService } from './lost.service';
import { VLostNearQuery, VLostQuery, VSaveLost, VUpdateLost } from './pets.validation';
import { AuthUser } from '../users/guards/user-auth.guard';
import { IUser } from '../users/entities/user.entity';
import { VSavePurchaseLost } from '../purchases/purchase.validation';
import { PurchasesService } from '../purchases/purchases.service';

@Controller('v1/pets')
export class LostController {
    constructor(
        private lostService: LostService,
        private purchaseService: PurchasesService,
    ) {}

    @Post('lost/near')
    public async getLostNear(@Body(ValidatorPipe) lostQuery: VLostNearQuery, @Pagination() paginator: VPagination) {
        const result = this.lostService.getLostNear(lostQuery, paginator);
        return result;
    }

    @Get('lost')
    public async getAll(@Query(ValidatorPipe) lostQuery: VLostQuery, @Pagination() pagination: VPagination) {
        const result = await this.lostService.getAll(lostQuery, pagination);
        return result.map((lost) => new DLost(lost));
    }

    @IsPetOwner()
    @ResolvePet()
    @UseGuards(AuthGuard('jwt'))
    @Post(':petId/lost')
    public async addLost(@ResolvedPet() pet: IPet, @Body(ValidatorPipe) saveLost: VSaveLost) {
        return await this.lostService.addLost(pet, saveLost);
    }

    @ResolveLost()
    @ResolvePet()
    @Get(':petId/lost/:lostId')
    public async getLost(@ResolvedPet() pet: IPet, @ResolvedLost() lost: ILost) {
        return new DLost(lost);
    }

    @IsPetOwner()
    @ResolveLost()
    @ResolvePet()
    @UseGuards(AuthGuard('jwt'))
    @Put(':petId/lost/:lostId')
    public async updateLost(@ResolvedPet() pet: IPet, @ResolvedLost() lost: ILost, @Body(ValidatorPipe) updateLost: VUpdateLost) {
        return await this.lostService.updateLost(pet, lost, updateLost);
    }

    @IsPetOwner()
    @ResolveLost()
    @ResolvePet()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':petId/lost/:lostId')
    public async deleteLost(@ResolvedPet() pet: IPet, @ResolvedLost() lost: ILost) {
        return await this.lostService.deleteLost(pet, lost);
    }

    @IsPetOwner()
    @ResolveLost()
    @ResolvePet()
    @UseGuards(AuthGuard('jwt'))
    @Put(':petId/lost/:lostId/purchase')
    public async purchase(
        @AuthUser() user: IUser, 
        @ResolvedPet() pet: IPet, 
        @ResolvedLost() lost: ILost, 
        @Body(ValidatorPipe) savePurchase: VSavePurchaseLost) {

            return this.purchaseService.processPurchase(user, savePurchase, (purchase) => {
                this.lostService.applyPurchase(pet, lost, purchase);
            })
    }
}