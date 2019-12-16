import * as mongoose from 'mongoose';

import { PaymentSchema, IPayment } from '../../shared/entities/common.entity';

export enum PURCHASE_TYPE {
    SERVICE = 'SERVICE',
    AD = 'AD',
    LOST = 'LOST',
}

export interface IPurchase extends mongoose.Document {
    userId: mongoose.Types.ObjectId,
    type: PURCHASE_TYPE,
    createDate: Date,
    range?: IPayment,
    duration?: IPayment
}

export const PurchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    type: { type: PURCHASE_TYPE, required: true },
    createDate: { type: Date, default: Date.now },
    range: { type: PaymentSchema },
    duration: { type: PaymentSchema }
});

const PurchaseModel = mongoose.model<IPurchase>('Purchase', PurchaseSchema);
export default PurchaseModel;