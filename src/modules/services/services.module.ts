import { Module } from '@nestjs/common';

import { FileModule } from '../common/files/files.module';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { PurchasesModule } from '../purchases/purchases.module';

@Module({
  imports: [
    FileModule,
    PurchasesModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [
    ServicesService,
  ],
})
export class ServicesModule {}
