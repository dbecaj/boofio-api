import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

import { MissingException } from '../../../shared/exceptions/rest.exception';

export class FileRequiredInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler) {

    const req = context.switchToHttp().getRequest();

    if (!req.file)
      throw new MissingException('file');

    return next.handle();
  }

}