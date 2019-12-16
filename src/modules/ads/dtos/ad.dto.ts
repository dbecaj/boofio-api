import { Types } from 'mongoose';

import { DLocation } from '../../../shared/dtos/common.dto';
import { IAd } from '../entities/ad.entity';
import { IImage } from '../../common/image/image.entity';
import { ILocation } from '../../../shared/entities/common.entity';

export class DAd {
    _id: Types.ObjectId;
    serviceId: Types.ObjectId;
    ownerId: Types.ObjectId;
    title: string;
    image?: IImage;
    location: ILocation;
    description: string;
    url?: string;
    discount: number;
    price: number;
    purchases: Types.ObjectId[];
    createDate: Date;
    expireDate: Date;
    range: number;
    distance?: number;

    constructor(ad: IAd) {
        this._id = ad._id;
        this.serviceId = ad.serviceId;
        this.ownerId = ad.ownerId;
        this.title = ad.title;
        this.image = ad.image;
        this.location = new DLocation(ad.location);
        this.description = ad.description;
        this.url = ad.url;
        this.discount = ad.discount;
        this.price = ad.price;
        this.purchases = ad.purchases;
        this.createDate = ad.createDate;
        this.expireDate = ad.expireDate;
        this.range = ad.range;
        this.distance = (ad as any).distance;
    }
}