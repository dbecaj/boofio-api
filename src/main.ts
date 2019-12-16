import './config';

import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as helmet from 'helmet';

import { AppModule } from './modules/app.module';
import { HttpResponseInterceptor } from './shared/interceptors/http-response.interceptor';
import { Logger } from './shared/logger';
import { GeneralExceptionFilter, HttpExceptionFilter, RestExceptionFilter } from './shared/exceptions/rest.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  
  // Intercep custom rest exceptions and general exceptions 
  // order is important last is most specific first is most generic
  app.useGlobalFilters(
    new GeneralExceptionFilter(), 
    new HttpExceptionFilter(), 
    new RestExceptionFilter()
  );
  // Format http response
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  // Log any unhandled promise rejections
  process.on('unhandledRejection', error => Logger.error(error));
  // Set static serving of images
  app.use('/uploads', express.static('uploads'));

  await app.listen(process.env.API_PORT);
  Logger.info(`API backend started on port ${process.env.API_PORT}`);
}
bootstrap();
