import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { IPayment, IPoint, PointSchema } from '../../../shared/entities/common.entity';
import { IImage, ImageSchema } from '../../common/image/image.entity';

export interface IPurchaseAd {
    range?: IPayment,
    duration?: IPayment,
}

export interface IAd extends Document {
    serviceId: mongoose.Types.ObjectId,
    ownerId: mongoose.Types.ObjectId,
    title: string,
    image?: IImage,
    location: IPoint,
    description: string,
    url?: string,
    discount: number,
    price: number,
    purchases: mongoose.Types.ObjectId[],
    createDate: Date,
    expireDate: Date,
    range: number,
}

const AdSchema = new mongoose.Schema({
    serviceId: { type: mongoose.Types.ObjectId, ref: 'Service', required: true },
    ownerId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    image: { type: ImageSchema },
    location: { type: PointSchema, required: true },
    description: { type: String, required: true },
    url: { type: String },
    discount: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }],
    createDate: { type: Date, default: Date.now },
    expireDate: { type: Date, required: true },
    range: { type: Number, required: true },
})
AdSchema.index({ location: '2dsphere' });

const AdModel = mongoose.model<IAd>('Ad', AdSchema);
export default AdModel;