import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';

import { DiskStorage } from '../files/disk.storage';
import { createFileKey, keyToUrl, urlToKey } from '../files/file.entity';
import { FilesService } from '../files/files.service';
import { IImage } from './image.entity';
import { MissingException } from '../../../shared/exceptions/rest.exception';

const sharp = require('sharp');

@Injectable()
export class ImageService {

    private readonly thumbDims = process.env.IMAGE_THUMB
        .split('x').map((value) => +value);
    private readonly smallDims = process.env.IMAGE_SMALL
        .split('x').map((value) => +value);

    constructor(
        private fileService: FilesService,
    ) {}

    public async createLocalImage(file: Express.Multer.File): Promise<IImage> {
        // Save original file first
        const key = createFileKey(file.originalname);
        const originalFile = await this.fileService.save(file.buffer, key);

        // Resize image to different dimensions and save them to disk for now
        let buffer;
        // 570cfc50a5f5729bdefedb52812e3fa701064e1c_512x512.jpeg
        const thumbKey = this.createKey(originalFile.key, this.thumbDims);
        buffer = await sharp(file.buffer).resize(this.thumbDims[0], this.thumbDims[1]).toBuffer();
        const thumbFile = await this.fileService.save(buffer, thumbKey);
        buffer = null; // Try to dereference memory

        const smallKey = this.createKey(originalFile.key, this.smallDims);
        buffer = await sharp(file.buffer).resize(this.smallDims[0], this.smallDims[1]).toBuffer();
        const smallFile = await this.fileService.save(buffer, smallKey);
        buffer = null;

        return { thumb: thumbFile.url, small: smallFile.url };
    }

    public async setImageAssigned(image: IImage) {
        await this.fileService.setAssigned([ image.thumb, image.small ]);
    }

    public async uploadImage(image: IImage) {
        // Upload image
        const urls = [ image.thumb, image.small ]
        const [ thumbUrl, smallUrl ] = await this.fileService.uploadMany(urls.map((url) => keyToUrl(url)));

        // Switch local urls with cloud urls
        image.thumb = thumbUrl;
        image.small = smallUrl;

        return image;
    }

    public async deleteImage(image: IImage) {
        const imageKeys = [ image.thumb, image.small ].map(url => urlToKey(url));
        await this.fileService.deleteMany(imageKeys);
    }

    private createKey(key: string, dims) {
        const keyBase = key.split('.')[0];
        const keyExt = path.parse(key).ext;
        return `${keyBase}_${dims[0]}x${dims[1]}${keyExt}`
    }
}