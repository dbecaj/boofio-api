import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

import FileModel from './file.entity';
import { FilesService } from './files.service';
import { DiskStorage } from './disk.storage';
import { CronJob } from 'cron';
import * as winston from 'winston';

@Injectable()
export class FileCleanupTask implements OnModuleInit, OnModuleDestroy {
    
    private job: CronJob;
    private logger: winston.Logger;

    constructor(
        private fileService: FilesService,
        private diskStorage: DiskStorage,
    ) {}

    onModuleInit() {
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
                new winston.transports.File({ filename: 'logs/file_cleanup.log' }),
              ]
        })

        this.logger.info(`Initalizing file-cleanup-task cron job with cron (${process.env.FILE_CLEANUP_CRON})`);
        this.job = new CronJob(process.env.FILE_CLEANUP_CRON, () => { return this.cleanup(this.diskStorage) });
        this.logger.info("Starting file-cleanup-task cron job");
        this.job.start();
    }

    onModuleDestroy() {
        this.logger.info("Stoping file-cleanup-task cron job!");
        this.job.stop();
    }

    async cleanup(diskStorage: DiskStorage) {
        this.logger.info("Starting file cleanup task");

        this.logger.info("Deleting non-assigned");
        const toDelete = [];
        const nonAssigned = await FileModel.find({ assigned: false });
        try {
            nonAssigned.forEach((file) => diskStorage.delete(file.key));
        }
        catch (err) {
            this.logger.error(err);
        }
        toDelete.push(...nonAssigned);

        this.logger.info("Deleting assigned and uploaded");
        const assignedAndUploaded = await FileModel.find({ assigned: true, uploaded: true });
        try {
            assignedAndUploaded.forEach((file) => diskStorage.delete(file.key));
        }
        catch (err) {
            this.logger.error(err);
        }
        toDelete.push(...assignedAndUploaded);

        // TODO: Figure out how to upload failed uploads and assign them to 
        // entities

        this.logger.info(`Removing ${toDelete.length} deleted file records`);
        await FileModel.deleteMany({ _id: { $in: toDelete.map((file) => file._id) }});
        this.logger.info("File cleanup task completed");
    }
}