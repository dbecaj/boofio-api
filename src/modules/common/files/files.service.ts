import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';

import { S3Service } from '../aws/s3.service';
import { DiskStorage } from './disk.storage';
import FileModel, { createFileKey } from './file.entity';
import { ImageService } from '../image/image.service';
import { Logger } from '../../../shared/logger';
import * as winston from 'winston';
import { MissingException, AlreadyAssignedException } from '../../../shared/exceptions/rest.exception';
import { IImage } from '../image/image.entity';

@Injectable()
export class FilesService {

    constructor(
        private diskStorage: DiskStorage,
        private s3Service: S3Service,
    ) {}

    public async save(buffer: Buffer, key: string) {
        const url = this.diskStorage.save(buffer, key);

        // Create record in files
        const record = new FileModel({ key, url });
        return await record.save();
    }

    /**
     * Attempt to upload file from disk storage to aws s3 and returns url
     * @param key Key of file in files collection
     */
    public async upload(key: string) {
        const stream = this.diskStorage.createReadStream(key);
        const { url } = await this.s3Service.uploadOne(key, stream);
        
        // Update record in files
        await FileModel.findOneAndUpdate({ key }, { $set: { url, uploaded: true }});

        return url;
    }

    public async uploadMany(keys: string[]) {
        const promises = [];
        keys.forEach((key) => {
            const stream = this.diskStorage.createReadStream(key);
            const promise = this.s3Service.upload(key, stream);
            promises.push(promise);
        });

        const result = await Promise.all(promises);

        await FileModel.updateMany({ key: { $in: keys }}, { $set: { uploaded: true }});

        return result.map((result) => result.Location);
    }

    public async setAssigned(urls: string[]) {
        const files = await FileModel.find({ url: { $in: urls }});

        // Check if any files are already assigned
        const alreadyAssigned = files.filter(file => file.assigned);
        if (alreadyAssigned.length > 0) {
            throw new AlreadyAssignedException(alreadyAssigned.map(file => file.url).join(', '));
        }

        // Set files to assigned
        await FileModel.updateMany({ _id: { $in: files.map(file => file._id) }}, { "$set": { assigned: true }});
    }

    /**
     * Delete object from disk/cloud with specified key
     * @param key object key to delete
     */
    public async deleteOne(key: string) {
        const file = await FileModel.findOne({ key });
        // Delete either from the cloud or from disk
        if (file.uploaded) await this.s3Service.deleteOne(key);
        await this.diskStorage.delete(key);

        await FileModel.deleteOne({ _id: file._id });
    }

    /**
     * Delete objects from disk/cloud with specified keys
     * @param keys object keys to delete
     */
    public async deleteMany(keys: string[]) {
        const files = await FileModel.find({ key: { $in: keys }});
        const promises = [];
        files.map(file => {
            if (file.uploaded) promises.push(this.s3Service.deleteOne(file.key));
            else this.diskStorage.delete(file.key);
        });

        await Promise.all(promises);

        await FileModel.deleteMany({ _id: { $in: files.map(file => file._id) }});
    }
}
