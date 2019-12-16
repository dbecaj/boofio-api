import { Module } from '@nestjs/common';

import { FileModule } from '../common/files/files.module';
import { ServicesModule } from '../services/services.module';
import { ProfileController } from './profile.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    ServicesModule,
    FileModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [ProfileController, UsersController],
})
export class UsersModule {}
