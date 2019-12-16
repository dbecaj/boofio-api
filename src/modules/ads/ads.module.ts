import { Module } from '@nestjs/common';

import { FileModule } from '../common/files/files.module';
import { ServicesModule } from '../services/services.module';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { PurchasesModule } from '../purchases/purchases.module';

@Module({
  imports: [
    ServicesModule,
    FileModule,
    PurchasesModule,
  ],
  controllers: [AdsController],
  providers: [AdsService],
  exports: [
    AdsService,
  ]
})
export class AdsModule {}
