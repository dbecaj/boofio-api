import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { IsOwner } from '../../shared/guards/is-owner.guard';
import { ValidatorPipe } from '../../shared/pipes/validator.pipe';
import { Pagination, VPagination } from '../../shared/validators/pagination.validation';
import { IUser } from '../users/entities/user.entity';
import { AuthUser } from '../users/guards/user-auth.guard';
import { DPurchase } from './purchase.dto';
import { IPurchase } from './purchase.entity';
import { ResolvedPurchase, ResolvePurchase } from './purchase.guard';
import { VSavePurchase } from './purchase.validation';
import { PurchasesService } from './purchases.service';

@UseGuards(AuthGuard('jwt'))
@Controller('v1/purchases')
export class PurchasesController {

    constructor(
        private purchaseService: PurchasesService,
    ) {}

    @IsOwner('purchase', 'userId')
    @ResolvePurchase()
    @Get(':purchaseId')
    async get(@ResolvedPurchase() purchase: IPurchase) {
        return new DPurchase(purchase);
    }

    @Get()
    async getCreated(@AuthUser() user: IUser, @Pagination() pagination: VPagination) {
        const result = await this.purchaseService.getCreated(user, pagination);
        return result.map((purchase) => new DPurchase(purchase));
    }

    @IsOwner('purchase', 'userId')
    @ResolvePurchase()
    @Delete(':purchaseId')
    async delete(@ResolvedPurchase() purchase: IPurchase) {
        return new DPurchase(await this.purchaseService.delete(purchase._id));
    }
}
