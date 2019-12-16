import * as mongoose from 'mongoose';

import { PET_DELETE_REASON, PET_TYPE } from '../pets.enum';
import { ILost, LostSchema } from './lost.entity';
import { IImage, ImageSchema } from '../../common/image/image.entity';

export interface IPetDeleteReason extends mongoose.Document {
    reason: PET_DELETE_REASON,
    date: Date,
}

const PetDeleteReasonSchema = new mongoose.Schema({
    reason: { type: PET_DELETE_REASON, required: true },
    date: { type: Date, required: true, default: Date.now },
}, { _id: false });

export interface IPet extends mongoose.Document {
    authorId: mongoose.Types.ObjectId,
    type: PET_TYPE,
    name: String,
    birthday: Date,
    owners: mongoose.Types.ObjectId[],
    deleteReason?: IPetDeleteReason,
    image?: IImage,
    lost?: ILost[],
}

const PetSchema = new mongoose.Schema({
    authorId: { type: mongoose.Types.ObjectId, ref: 'User', required: true},
    type: { type: PET_TYPE, required: true },
    name: { type: String, required: true },
    birthday: { type: Date, required: true, default: Date.now },
    owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    deleteReason: { type: PetDeleteReasonSchema },
    image: { type: ImageSchema, default: null },
    lost: [LostSchema],
});

const PetModel = mongoose.model<IPet>('Pet', PetSchema);
export default PetModel;