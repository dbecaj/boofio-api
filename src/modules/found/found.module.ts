import { Module } from '@nestjs/common';

import { PetsModule } from '../pets/pets.module';
import { FoundController } from './found.contoller';
import { FoundService } from './found.service';

@Module({
    imports: [
        PetsModule,
    ],
    controllers: [FoundController],
    providers: [FoundService],
})
export class FoundModule {}
