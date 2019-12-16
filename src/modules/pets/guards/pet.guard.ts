import { CanActivate, createParamDecorator, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';

import { ForbiddenException, NotFoundException } from '../../../shared/exceptions/rest.exception';
import { castToObjectId } from '../../../shared/pipes/object-id.pipe';
import { UserResolverGuard } from '../../users/guards/user-resolver.guard';
import { USER_ROLE } from '../../users/users.enum';
import PetModel from '../entities/pet.entity';

@Injectable()
export class IsPetOwnerGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // Check if the user is ADMIN
    if (req.user.role == USER_ROLE.ADMIN) {
        return true;
    }

    // Check if the user is in owners for the pet
    const found = req.pet.owners.find((ownerId) => req.user._id == ownerId);
    if (found) { 
        return true;
    }

    // Check if this is the pet author
    if (req.user._id.toString() == req.pet.authorId.toString()) {
        return true;
    }

    throw new ForbiddenException(`Access denied for pet`);
  }

}

/**
 * Guards that checks if authorized user is author of the pet or in the owners list
 */
export const IsPetOwner = () => UseGuards(IsPetOwnerGuard);

@Injectable()
export class PetResolverGuard implements CanActivate {

    constructor(
        private where: string,
        private id: string,
    ){}

    async canActivate(context: ExecutionContext) {
        // Check if the pet with the petId exists and if it does add it to our request object
        const req = context.switchToHttp().getRequest();

        const petId = castToObjectId(req[this.where][this.id], `request.${this.where}.${this.id}`);
        req.pet = await PetModel.findById(petId);

        if (!req.pet) {
            throw new NotFoundException(`request.${this.where}.${this.id}`);
        }

        return true;
    }
}

/**
 * Guard that finds the author of the pet and assigns it to request object
 */
export const ResolvePetAuthor = () => UseGuards(new UserResolverGuard('pet', 'authorId'));
export const ResolvedPetAuthor = createParamDecorator((data, req) => req.resolvedUser);

/**
 * Guard that finds the pet with id and assigns it to the request object
 * @param where Specifies where in the request object the id resides
 * @param id Specifies in what field in requested object is
 */
export const ResolvePet = (where: string = 'params', id: string = 'petId') => UseGuards(new PetResolverGuard(where, id));
export const ResolvedPet = createParamDecorator((data, req) => req.pet);