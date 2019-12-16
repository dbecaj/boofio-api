import { Stream } from 'stream';

export interface IUploadFile {
    key: string,
    stream: Stream,
}