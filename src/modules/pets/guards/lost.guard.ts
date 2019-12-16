import { CanActivate, createParamDecorator, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';

import { NotFoundException } from '../../../shared/exceptions/rest.exception';
import { castToObjectId } from '../../../shared/pipes/object-id.pipe';
import PetModel from '../entities/pet.entity';

@Injectable()
export class LostResolverGuard implements CanActivate {

    constructor(
        private where: string,
        private id: string,
    ) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        const lostId = castToObjectId(req[this.where][this.id], `request.${this.where}.${this.id}`);
        req.lost = await PetModel.aggregate([
                                            { $unwind: "$lost" },
                                            { $match: { "lost._id": lostId }}
                                        ]);

        // Return the nested lost object if it exists
        req.lost = req.lost[0] ? req.lost[0].lost : req.lost[0]; 

        if (!req.lost) {
            throw new NotFoundException(`request.${this.where}.${this.id}`);
        }

        return true;
    }
}

/**
 * Guard that finds the lost with id and assigns it to the request object
 * @param where Specifies where in the request object the id resides
 * @param id Specifies in what field in requested object is
 */
export const ResolveLost = (where: string = 'params', id: string = "lostId") => UseGuards(new LostResolverGuard(where, id));
export const ResolvedLost = createParamDecorator((data, req) => req.lost);