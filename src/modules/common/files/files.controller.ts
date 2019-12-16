import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express/multer';

import { extensionFilter } from './extension-filter';
import { FileRequiredInterceptor } from './file-required.interceptor';
import { FilesService } from './files.service';
import { ImageService } from '../image/image.service';
import { IImage } from '../image/image.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('v1/files')
export class FilesController {
    constructor(
        private imageService: ImageService
    ) {}

    @UseInterceptors(FileInterceptor(
        'file', 
        extensionFilter(['.png', '.jpg', '.jpeg', '.bmp'])),
        FileRequiredInterceptor
    )
    @Post('image')
    async saveImage(@UploadedFile() file): Promise<IImage> {
        return this.imageService.createLocalImage(file);
    }
}
