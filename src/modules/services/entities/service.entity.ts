import * as mongoose from 'mongoose';
import { Document } from "mongoose";
import { ILocation, LocationSchema, IPoint, PointSchema, IPayment, PaymentSchema } from "../../../shared/entities/common.entity";
import { SERVICE_TYPE } from "../services.enum";
import { IPurchase } from '../../purchases/purchase.entity';
import { GeoUtil } from '../../../shared/utils/geo.util';
import { IImage, ImageSchema } from '../../common/image/image.entity';

export interface IBusinessHours {
    opening: String,
    closing: String,
}

const BuisinessHoursSchema = new mongoose.Schema({
    opening: { type: String, required: true },
    closing: { type: String, required: true },
}, { _id: false });

export interface IOpeningHours {
    monday: IBusinessHours,
    tuesday: IBusinessHours,
    wednesday: IBusinessHours,
    thursday: IBusinessHours,
    friday: IBusinessHours,
    saturday: IBusinessHours,
    sunday: IBusinessHours,
}

const OpeningHoursSchema = new mongoose.Schema({ 
    monday: { type: BuisinessHoursSchema, default: null },
    tuesday: { type: BuisinessHoursSchema, default: null },
    wednesday: { type: BuisinessHoursSchema, default: null },
    thursday: { type: BuisinessHoursSchema, default: null },
    friday: { type: BuisinessHoursSchema, default: null },
    saturday: { type: BuisinessHoursSchema, default: null },
    sunday: { type: BuisinessHoursSchema, default: null },
}, { _id: false });

export interface IPurchaseService {
    range?: IPayment,
}

const PurchaseServiceSchema = new mongoose.Schema({
    range: { type: PaymentSchema },
}, { _id: false });

export interface IService extends Document {
    ownerId: mongoose.Types.ObjectId;
    type: SERVICE_TYPE,
    name: string,
    location: IPoint,
    phone: string,
    email: string,
    openingHours: IOpeningHours,
    description: string, 
    range: number,
    createDate: Date,
    purchases: mongoose.Types.ObjectId[],
    image: IImage,
    street: string,
    post: string,
}

const ServiceSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: SERVICE_TYPE, required: true },
    name: { type: String, required: true },
    location: { type: PointSchema, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    openingHours: { type: OpeningHoursSchema, required: true },
    description: { type: String, required: true },
    range: { type: Number, required: true },
    createDate: { type: Date, default: Date.now },
    purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }],
    image: { type: ImageSchema },
    street: { type: String, required: true },
    post: { type: String, required: true },
});
ServiceSchema.index({ location: '2dsphere' });

const ServiceModel = mongoose.model<IService>('Service', ServiceSchema);
export default ServiceModel;