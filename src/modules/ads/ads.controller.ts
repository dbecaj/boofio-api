import { Body, Controller, Delete, Get, Post, Put, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { IsOwner } from '../../shared/guards/is-owner.guard';
import { ValidatorPipe } from '../../shared/pipes/validator.pipe';
import { Pagination, VPagination } from '../../shared/validators/pagination.validation';
import { IService } from '../services/entities/service.entity';
import { ResolvedService, ResolveService } from '../services/guards/service-resolver.guard';
import { IUser } from '../users/entities/user.entity';
import { AuthUser } from '../users/guards/user-auth.guard';
import { AdsService } from './ads.service';
import { VAdNearQuery, VAdQuery, VSaveAd, VUpdateAd } from './ads.validation';
import { DAd } from './dtos/ad.dto';
import { IAd } from './entities/ad.entity';
import { ResolveAd, ResolvedAd } from './guards/ad-service-resolver.guard';
import { ResolveImage } from '../common/image/image.guard';
import { VSavePurchaseAd } from '../purchases/purchase.validation';
import { PurchasesService } from '../purchases/purchases.service';

@Controller('v1/ads')
export class AdsController {
    
    constructor(
        private adsService: AdsService,
        private purchaseService: PurchasesService,
    ){}

    @Get()
    async getAll(@Query(ValidatorPipe) adQuery: VAdQuery, @Pagination() pagination: VPagination) {
        const result = await this.adsService.getAll(adQuery, pagination);
        return result.map((ad) => new DAd(ad));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('created')
    async getCreated(@AuthUser() user: IUser, @Pagination() pagination: VPagination) {
        const result = await this.adsService.getCreated(user, pagination);
        return result.map((ad) => new DAd(ad));
    }

    @Post('near')
    async getNear(@Body(ValidatorPipe) adQuery: VAdNearQuery, @Pagination() paginator: VPagination){
        const result = await this.adsService.getNear(adQuery, paginator);
        return result.map((ad) => new DAd(ad));
    }

    @ResolveAd()
    @Get(':adId')
    async get(@ResolvedAd() ad: IAd) {
        return new DAd(ad);
    }

    // Allow creation if the service that this ad belongs to has the same ownerId as the user auth id
    @ResolveImage()
    @IsOwner('service')
    @ResolveService('body')
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@AuthUser() user: IUser, @ResolvedService() service: IService, @Body(ValidatorPipe) ad: VSaveAd) {
        return new DAd(await this.adsService.create(user, service, ad));
    }

    @ResolveImage()
    @IsOwner('ad')
    @ResolveAd()
    @UseGuards(AuthGuard('jwt'))
    @Put(':adId')
    async update(@ResolvedAd() ad: IAd, @Body(ValidatorPipe) updateAd: VUpdateAd) {
        return new DAd(await this.adsService.update(ad._id, updateAd));
    }

    @IsOwner('ad')
    @ResolveAd()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':adId')
    async delete(@ResolvedAd() ad: IAd) {
        return new DAd(await this.adsService.delete(ad));
    }

    @IsOwner('ad')
    @ResolveAd()
    @UseGuards(AuthGuard('jwt'))
    @Put(':adId/purchase')
    async purchase(@AuthUser() user: IUser, @ResolvedAd() ad: IAd, 
                    @Body(ValidatorPipe) savePurchase: VSavePurchaseAd) {
        return this.purchaseService.processPurchase(user, savePurchase, (purchase) => {
            this.adsService.applyPurchase(ad, purchase);
        })
    }
}
