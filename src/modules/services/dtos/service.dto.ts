import { Types } from 'mongoose';

import { DLocation } from '../../../shared/dtos/common.dto';
import { IOpeningHours, IService, IBusinessHours } from '../entities/service.entity';
import { SERVICE_TYPE } from '../services.enum';
import { IImage } from '../../common/image/image.entity';

export class DOpeningHours {
    monday: IBusinessHours;
    tuesday: IBusinessHours;
    wednesday: IBusinessHours;
    thursday: IBusinessHours;
    friday: IBusinessHours;
    saturday: IBusinessHours;
    sunday: IBusinessHours;

    constructor(openingHours: IOpeningHours) {
        this.monday = openingHours.monday || { opening: null, closing: null };
        this.tuesday = openingHours.tuesday || { opening: null, closing: null };
        this.wednesday = openingHours.wednesday || { opening: null, closing: null };
        this.thursday = openingHours.thursday || { opening: null, closing: null };
        this.friday = openingHours.friday || { opening: null, closing: null };
        this.saturday = openingHours.saturday || { opening: null, closing: null };
        this.sunday = openingHours.sunday || { opening: null, closing: null };
    }
}

export class DPublicService {
    _id: Types.ObjectId;
    ownerId: Types.ObjectId;
    type: SERVICE_TYPE;
    name: string;
    location: DLocation;
    phone: string;
    email: string;
    openingHours: IOpeningHours;
    description: string; 
    range: number;
    createDate: Date;
    image?: IImage;
    street: string;
    post: string;

    constructor(service: IService) {
        this._id = service._id;
        this.ownerId = service.ownerId;
        this.type = service.type;
        this.name = service.name;
        this.location = new DLocation(service.location);
        this.phone = service.phone;
        this.email = service.email;
        this.openingHours = service.openingHours;
        this.description = service.description;
        this.range = service.range;
        this.createDate = service.createDate;
        this.image = service.image;
        this.street = service.street;
        this.post = service.post;
    }
}

export class DPrivateService extends DPublicService {
    purchases: Types.ObjectId[];

    constructor(service: IService) {
        super(service);

        this.purchases = service.purchases;
    }
}

export class DNearService extends DPublicService {
    distance: number;

    constructor(service: IService) {
        super(service);

        this.distance = (service as any).distance;
    }
}
