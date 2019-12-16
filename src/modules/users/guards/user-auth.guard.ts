import { createParamDecorator } from '@nestjs/common';

/**
 * Extract the user that is in request object for convinience 
 * */
export const AuthUser = createParamDecorator((data, req) => req.user);