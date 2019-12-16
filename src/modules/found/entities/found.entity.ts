import * as mongoose from 'mongoose';

import { IPoint, PointSchema } from '../../../shared/entities/common.entity';
import { PET_TYPE } from '../../pets/pets.enum';

export interface IFound extends mongoose.Document {
    userId: mongoose.Types.ObjectId,
    petType: PET_TYPE,
    name?: string,
    description: string,
    date: Date,
    location: IPoint,
}

const FoundSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    petType: { type: PET_TYPE, required: true },
    name: { type: String },
    description: { type: String, required: true},
    date: { type: Date, required: true },
    location: { type: PointSchema, required: true },
});

const FoundModel = mongoose.model<IFound>('Found', FoundSchema, 'found');

export { FoundModel };