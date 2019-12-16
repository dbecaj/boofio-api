import { Module } from '@nestjs/common';

import { AdsModule } from '../ads/ads.module';
import { FoundModule } from '../found/found.module';
import { PetsModule } from '../pets/pets.module';
import { ServicesModule } from '../services/services.module';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';

@Module({
  imports: [
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [
    PurchasesService,
  ],
})
export class PurchasesModule {}
