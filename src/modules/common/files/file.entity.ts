import * as crypto from 'crypto';
import * as mongoose from 'mongoose';
import * as path from 'path';

export interface IFile extends mongoose.Document {
    key: string;
    url: string; // Is composed of key
    uploaded: boolean,
    assigned: boolean,
    createdDate: Date;
}

const FileSchema = new mongoose.Schema({
    key: { type: String, required: true },
    url: { type: String, required: true },
    uploaded: { type: Boolean, default: false },
    assigned: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
})

const FileModel = mongoose.model<IFile>('File', FileSchema);
export default FileModel;

/**
 * Generates a unique file key with the passed file extension
 * @param filename Filename to extract extension from and add to the file key
 */
export function createFileKey(filename: string): string {
    return `${crypto.createHash('sha1').update(`${Date.now()}${Math.random()}`).digest('hex')}${path.extname(filename).toLowerCase()}`;
}

export function keyToUrl(url: string): string {
    return url.split('/').pop();
}

export function urlToKey(url: string) {
    return url.split('/').pop();
}