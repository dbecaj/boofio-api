import { CanActivate, createParamDecorator, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';

import { NotFoundException } from '../../../shared/exceptions/rest.exception';
import { castToObjectId } from '../../../shared/pipes/object-id.pipe';
import UserModel from '../entities/user.entity';

@Injectable()
export class UserResolverGuard implements CanActivate {

    constructor(
        private where: string,
        private id: string,
    ){}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        const userId = castToObjectId(req[this.where][this.id], `request.${this.where}.${this.id}`);
        req.resolvedUser = await UserModel.findById(userId);

        if (!req.resolvedUser) {
            throw new NotFoundException(`request.${this.where}.${this.id}`);
        }

        return true;
    }
}

/**
 * Guard that finds the user with id and assigns it to the request object
 * @param where Specifies where in the request object the id resides
 * @param id Specifies in what field in request object the user id is
 */
export const ResolveUser = (where: string = 'params', id: string = 'userId') => UseGuards(new UserResolverGuard(where, id));
export const ResolvedUser = createParamDecorator((data, req) => req.resolvedUser);