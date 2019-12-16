import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { InternalServerException, FileDeleteException, FileIntegrityException } from '../../../shared/exceptions/rest.exception';

@Injectable()
export class DiskStorage {
    public static SAVE_PATH = './uploads';

    save(buffer: Buffer, key: string) {
        const writeStream = this.createWriteStream(key);
        writeStream.write(buffer);
        writeStream.end();

        return DiskStorage.createUrl(key);
    }

    delete(key: string) {
        const path = DiskStorage.createPath(key);
        if (!DiskStorage.doesExist(key)) {
            throw new FileIntegrityException(`${path} file doesn't exist!`)
        }

        fs.unlink(path, (err) => {
            if (err) {
                throw new FileDeleteException(err.message);
            }
        });
    }

    createReadStream(key: string): fs.ReadStream {
        return fs.createReadStream(DiskStorage.createPath(key));
    }

    createWriteStream(key: string): fs.WriteStream {
        // Create directory if it doesn't exist
        if (!fs.existsSync(DiskStorage.SAVE_PATH)) {
            fs.mkdirSync(DiskStorage.SAVE_PATH);
        }

        // Save file to disk
        return fs.createWriteStream(DiskStorage.createPath(key));
    }

    static doesExist(key: string): boolean {
        return fs.existsSync(DiskStorage.createPath(key));
    }

    public static createUrl(key: string) {
        return `${process.env.API_URL}/uploads/${key}`;
    }

    public static createPath(key: string) {
        return `${DiskStorage.SAVE_PATH}/${key}`;
    }

    public fromUrl(url: string) {
        return url.split('/').pop();
    }
}