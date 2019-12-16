import { Module } from '@nestjs/common';

import { AwsModule } from '../aws/aws.module';
import { DiskStorage } from './disk.storage';
import { FileCleanupTask } from './file-cleanup.task';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ImageService } from '../image/image.service';

@Module({
  imports: [
    AwsModule,
  ],
  controllers: [FilesController],
  providers: [
    DiskStorage,
    FilesService,
    FileCleanupTask,
    ImageService,
  ],
  exports: [
    FilesService,
    ImageService,
  ],
})
export class FileModule {}
