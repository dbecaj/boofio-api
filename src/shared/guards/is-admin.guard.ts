import { CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';

import { USER_ROLE } from '../../modules/users/users.enum';
import { ForbiddenException } from '../exceptions/rest.exception';

@Injectable()
export class IsAdminGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // Check if the user is ADMIN
    if (req.user.role != USER_ROLE.ADMIN) {
      throw new ForbiddenException(`Access denied: not ADMIN`);
    }

    return true;
  }

}

/**
 * Guard that checks if the authenticated user is ADMIN
 */
export const IsAdmin = () => UseGuards(IsAdminGuard);