import * as mongoose from 'mongoose';

import { IPayment, IPoint, PaymentSchema, PointSchema } from '../../../shared/entities/common.entity';

export interface ILost extends mongoose.Document {
    location: IPoint,
    description: string,
    reward: number,
    createDate: Date,
    expireDate: Date,
    range: number,
    found: boolean,
    purchases: mongoose.Types.ObjectId[]
}

export const LostSchema = new mongoose.Schema({
    location: { type: PointSchema, required: true },
    description: { type: String, required: true },
    reward: { type: Number, required: true },
    createDate: { type: Date, default: Date.now() },
    expireDate: { type: Date, required: true },
    range: { type: Number, required: true },
    found: { type: Boolean, default: false },
    purchases: [{ type: mongoose.Schema.Types.ObjectId }],
});
LostSchema.index({ location: '2dsphere' });

export interface IPurchaseLost {
    range?: IPayment,
    duration?: IPayment,
}

export const PurchaseLostSchema = new mongoose.Schema({
    range: { type: PaymentSchema },
    duration: { type: PaymentSchema }
}, { _id: false });