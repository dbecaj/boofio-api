import { Body, Controller, Delete, Get, Post, Put, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { IsOwner } from '../../shared/guards/is-owner.guard';
import { ValidatorPipe } from '../../shared/pipes/validator.pipe';
import { Pagination, VPagination } from '../../shared/validators/pagination.validation';
import { IUser } from '../users/entities/user.entity';
import { AuthUser } from '../users/guards/user-auth.guard';
import { DPrivateService, DNearService, DPublicService } from './dtos/service.dto';
import { IService } from './entities/service.entity';
import { ResolvedService, ResolveService } from './guards/service-resolver.guard';
import { ServicesService } from './services.service';
import { VSaveService, VServiceNearQuery, VServiceQuery, VServiceUpdate } from './services.validator';
import { DAd } from '../ads/dtos/ad.dto';
import { ResolveImage } from '../common/image/image.guard';
import { PurchasesService } from '../purchases/purchases.service';
import { VSavePurchaseService } from '../purchases/purchase.validation';

@Controller('v1/services')
export class ServicesController {
    
    constructor(
        private servicesService: ServicesService,
        private purchaseService: PurchasesService,
    ){}

    @Post('near')
    async getNear(@Body(ValidatorPipe) serviceQuery: VServiceNearQuery, @Pagination() paginator: VPagination) {
        const result = await this.servicesService.getNear(serviceQuery, paginator);
        return result.map((service) => new DNearService(service));
    }

    @Get()
    async getAll(@Query(ValidatorPipe) serviceQuery: VServiceQuery, @Pagination() pagination: VPagination) {
        const result = await this.servicesService.getAll(serviceQuery, pagination);
        return result.map((service) => new DPublicService(service));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('created')
    async getCreated(@AuthUser() user: IUser, @Pagination() pagination: VPagination) {
        const result = await this.servicesService.getCreated(user, pagination);
        return result.map((service) => new DPrivateService(service));
    }

    @ResolveService()
    @Get(":serviceId")
    async get(@ResolvedService() service: IService) {
        return new DPublicService(service);
    }

    @ResolveImage()
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@AuthUser() user: IUser, @Body(ValidatorPipe) saveService: VSaveService) {
        return new DPrivateService(await this.servicesService.create(user, saveService));
    }

    @ResolveImage()
    @IsOwner('service')
    @ResolveService()
    @UseGuards(AuthGuard('jwt'))
    @Put(':serviceId')
    async update(@ResolvedService() service: IService, @Body(ValidatorPipe) updateService: VServiceUpdate) {
        return new DPrivateService(await this.servicesService.update(service._id, updateService));
    }

    @IsOwner('service')
    @ResolveService()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':serviceId')
    async delete(@ResolvedService() service: IService) {
        return new DPrivateService(await this.servicesService.delete(service));
    }

    @ResolveService()
    @Get(':serviceId/ads')
    async getServiceAds(@ResolvedService() service: IService, @Pagination() pagination: VPagination) {
        const result = await this.servicesService.getServiceAds(service, pagination);
        return result.map((ad) => new DAd(ad));
    }

    @IsOwner('service')
    @ResolveService()
    @UseGuards(AuthGuard('jwt'))
    @Put(':serviceId/purchase')
    async purchase(@AuthUser() user: IUser, @ResolvedService() service: IService, 
                    @Body(ValidatorPipe) savePurchase: VSavePurchaseService) {
        return this.purchaseService.processPurchase(user, savePurchase, (purchase) => {
            this.servicesService.applyPurchase(service, purchase);
        });
    }
}
