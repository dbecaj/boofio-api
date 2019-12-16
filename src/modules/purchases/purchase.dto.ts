import * as mongoose from 'mongoose';

import { IPurchase, PURCHASE_TYPE } from './purchase.entity';
import { IPayment } from '../../shared/entities/common.entity';

export class DPurchase {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    type: PURCHASE_TYPE;
    createDate: Date;
    range?: IPayment;
    duration?: IPayment

    constructor(purchase: IPurchase) {
        this._id = purchase._id;
        this.userId = purchase.userId;
        this.type = purchase.type;
        this.createDate = purchase.createDate;
        this.range = purchase.range;
        this.duration = purchase.duration;
    }
}