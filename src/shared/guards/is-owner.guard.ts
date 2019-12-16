import { BadRequestException, CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';

import { USER_ROLE } from '../../modules/users/users.enum';
import { ForbiddenException, InternalServerException } from '../exceptions/rest.exception';

/*
    Takes in the field name of the request object where the ownerId should be,
    also the order in which it is defined has to be behind the entity resolvers to have access
    to them
*/
@Injectable()
export class IsOwnerGuard implements CanActivate {

  constructor(
      private reqEntity: string,
      private ownerId: string,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // Check if the passed reqEntity field exist in our request object (if this is wrong it's usually the programmers fault)
    if (!req[this.reqEntity]) {
        throw new InternalServerException("Problem with accessing the ownership of the requested entity");
    }

    // We can also specify what the ownerId field is
    if (!req[this.reqEntity][this.ownerId]) {
      throw new InternalServerException("Problem with accessing the ownership field of the requested entity");
    }

    // Check if the user id is the same as the ownerId on the entity except if the user is ADMIN
    if ((req.user.role != USER_ROLE.ADMIN) && 
        (req.user._id.toString() !== req[this.reqEntity][this.ownerId].toString())) {
      throw new ForbiddenException(`Access denied for ${this.reqEntity}`);
    }

    return true;
  }

}

/**
 * Guard that checks if authenticated user is the owner of the entity or ADMIN
 * @param reqEntity Specifies in what request field the ownerId will be in
 * @param ownerId Specifies what the ownerId field will be called
 */
export const IsOwner = (reqEntity: string, ownerId = 'ownerId') => UseGuards(new IsOwnerGuard(reqEntity, ownerId));