import { CanActivate, createParamDecorator, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';

import { NotFoundException } from '../../../shared/exceptions/rest.exception';
import { castToObjectId } from '../../../shared/pipes/object-id.pipe';
import AdModel from '../entities/ad.entity';

/**
    Resolves ad and service and puts them in the request
*/
@Injectable()
export class AdResolverGuard implements CanActivate {

    constructor(
        private where: string,
        private id: string,
    ) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        const adId = castToObjectId(req[this.where][this.id], `request.${this.where}.${this.id}`);
        req.ad = await AdModel.findById(adId);

        if (!req.ad) {
            throw new NotFoundException(`request.${this.where}.${this.id}`);
        }

        return true;
    }
}

/**
 * Guard that finds the ad with id and assigns it to the request object
 * @param where Specifies where in the request object the id resides
 * @param id Specifies in what field in requested object is
 */
export const ResolveAd = (where: string = 'params', id: string = 'adId') => UseGuards(new AdResolverGuard(where, id));
export const ResolvedAd = createParamDecorator((data, req) => req.ad);