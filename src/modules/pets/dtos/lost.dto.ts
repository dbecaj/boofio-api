import * as mongoose from 'mongoose';

import { DLocation } from '../../../shared/dtos/common.dto';
import { ILocation, IPoint } from '../../../shared/entities/common.entity';
import { ILost } from '../entities/lost.entity';

export class DLost {
    _id: mongoose.Types.ObjectId;
    location: IPoint | ILocation;
    description: string;
    reward: number;
    createDate: Date;
    expireDate: Date;
    range: number;
    found: boolean;
    purchases: mongoose.Types.ObjectId[]

    constructor(lost: ILost) {
        this._id = lost._id;
        this.location = new DLocation(lost.location as IPoint);
        this.description = lost.description;
        this.reward = lost.reward;
        this.createDate = lost.createDate;
        this.expireDate = lost.expireDate;
        this.range = lost.range;
        this.found = lost.found;
        this.purchases = lost.purchases;
    }
}