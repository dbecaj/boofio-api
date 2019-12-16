import { CanActivate, createParamDecorator, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';

import { BadRequestException, NotFoundException, NotProcessedException } from '../../shared/exceptions/rest.exception';
import { castToObjectId } from '../../shared/pipes/object-id.pipe';
import { AdsService } from '../ads/ads.service';
import { LostService } from '../pets/lost.service';
import { ServicesService } from '../services/services.service';
import PurchaseModel from './purchase.entity';

@Injectable()
export class PurchaseResolverGuard implements CanActivate {

    constructor(
        private where: string,
        private id: string,
    ) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        const purchaseId = castToObjectId(req[this.where][this.id], `request.${this.where}.${this.id}`);
        req.purchase = await PurchaseModel.findById(purchaseId);

        if (!req.purchase) {
            throw new NotFoundException(`request.${this.where}.${this.id}`);
        }

        return true;
    }
}

/**
 * Guard that finds the purchase with id and assigns it to the request object
 * @param where Specifies where in the request object the id resides
 * @param id Specifies in what field in requested object is
 */
export const ResolvePurchase = (where: string = "params", id: string = "purchaseId") => UseGuards(new PurchaseResolverGuard(where, id));
export const ResolvedPurchase = createParamDecorator((data, req) => req.purchase);