import { Module } from '@nestjs/common';

import { FileModule } from '../common/files/files.module';
import { UsersModule } from '../users/users.module';
import { LostController } from './lost.controller';
import { LostService } from './lost.service';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { ImageService } from '../common/image/image.service';
import { PurchasesModule } from '../purchases/purchases.module';

@Module({
    imports: [
        UsersModule,
        FileModule,
        PurchasesModule,
    ],
    controllers: [LostController, PetsController],
    providers: [LostService, PetsService],
    exports: [
        PetsService,
        LostService,
    ],
})
export class PetsModule {}
