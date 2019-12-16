import * as mongoose from 'mongoose';

export interface IImage {
    thumb: string,
    small: string,
}

export const ImageSchema = new mongoose.Schema({
    thumb: { type: String, required: true },
    small: { type: String, required: true },
}, { _id: false });