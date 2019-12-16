import { Module } from '@nestjs/common';

import { AdsModule } from './ads/ads.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './common/files/files.module';
import { FoundModule } from './found/found.module';
import { PetsModule } from './pets/pets.module';
import { PurchasesModule } from './purchases/purchases.module';
import { ServicesModule } from './services/services.module';
import { UsersModule } from './users/users.module';




@Module({
  imports: [
    PetsModule,
    AuthModule,
    UsersModule,
    ServicesModule,
    AdsModule,
    FoundModule,
    PurchasesModule,
    FileModule,
  ],
})
export class AppModule {}
