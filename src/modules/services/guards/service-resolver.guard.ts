import { CanActivate, createParamDecorator, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';

import { NotFoundException } from '../../../shared/exceptions/rest.exception';
import { castToObjectId } from '../../../shared/pipes/object-id.pipe';
import ServiceModel from '../entities/service.entity';

@Injectable()
export class ServiceResolverGuard implements CanActivate {

    constructor(
        private where: string,
        private id: string
    ) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        const serviceId = castToObjectId(req[this.where][this.id], `request.${this.where}.${this.id}`);
        req.service = await ServiceModel.findById(serviceId);

        if (!req.service) {
            throw new NotFoundException(`request.${this.where}.${this.id}`);
        }

        return true;
    }
}

/**
 * Guard that finds the service with id and assigns it to the request object
 * @param where Specifies where in the request object the service resides
 * @param id Specifies in what field in request object the service id is
 */
export const ResolveService = (where: string = 'params', id: string = 'serviceId') => UseGuards(new ServiceResolverGuard(where, id));
export const ResolvedService = createParamDecorator((data, req) => req.service);