import { CanActivate, createParamDecorator, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';

import { NotFoundException } from '../../../shared/exceptions/rest.exception';
import { castToObjectId } from '../../../shared/pipes/object-id.pipe';
import { FoundModel } from '../entities/found.entity';

@Injectable()
export class FoundResolverGuard implements CanActivate {

    constructor(
        private where: string,
        private id: string,
    ){}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        const foundId = castToObjectId(req[this.where][this.id], `request.${this.where}.${this.id}`);
        req.found = await FoundModel.findById(foundId);

        if (!req.found) {
            throw new NotFoundException(`request.${this.where}.${this.id}`);
        }

        return true;
    }
}

/**
 * Guard that finds the found with id and assigns it to the request object
 * @param where Specifies where in the request object the id resides
 * @param id Specifies in what field in requested object is
 */
export const ResolveFound = (where: string = 'params', id: string = 'foundId') => UseGuards(new FoundResolverGuard(where, id));
export const ResolvedFound = createParamDecorator((data, req) => req.found);