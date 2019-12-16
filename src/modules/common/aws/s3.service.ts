import { file } from '@babel/types';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Config, S3 } from 'aws-sdk';
import * as mimeType from 'mime-types';
import * as path from 'path';
import { Stream } from 'stream';

import { IUploadFile } from './aws.entity';
import * as winston from 'winston';

@Injectable()
export class S3Service implements OnModuleInit {

    private readonly BUCKET = process.env.AWS_S3_BUCKET_NAME;
    private s3: S3;
    private logger: winston.Logger;

    onModuleInit() {
        this.s3 = new S3(new Config({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        }));

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({
                  format: 'YYYY-MM-DD HH:mm:ss'
                }),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.File({ filename: 'logs/s3.log' }),
            ]
        })
    }

    async upload(key: string, stream: Stream): Promise<S3.ManagedUpload.SendData> {
        const uploadStream = this.s3.upload({
            Bucket: this.BUCKET,
            Key: key,
            ACL: 'public-read',
            Body: stream,
            ContentType: '' + mimeType.contentType(path.extname(key)),
            CacheControl: 'public, max-age=31536000',
        });
        const promise = uploadStream.promise();
        promise.catch((err) => {
            this.logger.error(err);
        });

        return promise;
    }

    async uploadOne(key: string, stream: Stream) {
        const response = await this.upload(key, stream);
        return { url: response.Location };
    }

    async uploadMany(files: IUploadFile[]) {
        const promises = [];
        files.forEach((file) => promises.push(this.upload(file.key, file.stream)));
        const result = await Promise.all(promises);
        return result.map((response) => {  return { url: response.Location} });
    }

    async deleteOne(key: string) {
        const deleteStream = this.s3.deleteObject({
            Bucket: this.BUCKET,
            Key: key
        });

        const promise = deleteStream.promise();
        promise.catch(err => {
            this.logger.error(err);
        });

        return promise;
    }

    async deleteMany(keys: string[]) {
        // You can delete up to 1000 keys
        const deleteStream = this.s3.deleteObjects({
            Bucket: this.BUCKET,
            Delete: {
                Objects: keys.map(key => { return { Key: key }; })
            }
        });

        const promise = deleteStream.promise();
        promise.catch(err => {
            this.logger.error(err);
        })

        return promise;
    }
}