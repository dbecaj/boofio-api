import { Types } from 'mongoose';

import { DLocation } from '../../../shared/dtos/common.dto';
import { PET_TYPE } from '../../pets/pets.enum';
import { IFound } from '../entities/found.entity';

export class DFound {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    petType: PET_TYPE;
    name?: string;
    description: string;
    date: Date;
    location: DLocation;

    constructor(found: IFound) {
        this._id = found._id;
        this.userId = found.userId;
        this.petType = found.petType;
        this.name = found.name;
        this.description = found.description;
        this.date = found.date;
        this.location = new DLocation(found.location);
    }
}