import { Transform, Type } from 'class-transformer';
import { IsDefined, IsMongoId, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import * as mongoose from 'mongoose';

import { GeoUtil } from '../../shared/utils/geo.util';
import { VSaveImage, VSaveLocation } from '../../shared/validators/common.validation';
import { IsUndefined } from '../../shared/validators/is-undefined.validator';

export class VSaveAd {
    @IsDefined() @IsMongoId()
    serviceId: mongoose.Types.ObjectId;

    @IsDefined() @IsString()
    title: string;

    @IsOptional() @ValidateNested() @Type(() => VSaveImage)
    image: VSaveImage;

    @IsDefined() @Type(() => VSaveLocation) @ValidateNested()
    location: any;

    @IsDefined() @IsString()
    description: string;

    @IsOptional() @IsUrl()
    url: string;

    @IsOptional() @IsNumber()
    discount: number;

    @IsDefined() @IsNumber()
    price: number;
}

export class VUpdateAd {
    @IsOptional() @IsMongoId()
    serviceId: mongoose.Types.ObjectId;

    @IsOptional() @IsString()
    title: string;

    @IsOptional() @ValidateNested() @Type(() => VSaveImage)
    image: VSaveImage;

    @IsOptional() @Type(() => VSaveLocation) @ValidateNested()
    location: any;

    @IsOptional() @IsString()
    description: string;

    @IsOptional() @IsUrl()
    url: string;

    @IsOptional() @IsNumber()
    discount: number;

    @IsOptional() @IsNumber()
    price: number;
}

export class VAdQuery {
    @IsOptional() @IsString()
    ownerId: string;

    @IsOptional() @IsMongoId()
    serviceId: mongoose.Types.ObjectId;

    @IsOptional() @IsString()
    title: string;

    @IsOptional() @ValidateNested() @Type(() => VSaveImage)
    image: VSaveImage;

    @IsOptional() @Type(() => VSaveLocation) @ValidateNested()
    @Transform((location) => GeoUtil.locationToGeoJSONPoint(location))
    location: any;

    @IsOptional() @IsString()
    description: string;

    @IsOptional() @IsUrl()
    url: string;

    @IsOptional() @IsNumber()
    discount: number;

    @IsOptional() @IsNumber()
    price: number;
}

export class VAdNearQuery {
    @IsDefined() @ValidateNested() @Type(() => VSaveLocation) 
    location: VSaveLocation;

    toPlainObject() {
        return Object.assign({}, this);
    }
}