import { Transform, Type } from 'class-transformer';
import {
    IsDateString,
    IsDefined,
    IsEmail,
    IsIn,
    IsMilitaryTime,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    ValidateNested,
    IsUrl,
} from 'class-validator';
import * as _ from 'lodash';

import { GeoUtil } from '../../shared/utils/geo.util';
import { VSaveImage, VSaveLocation } from '../../shared/validators/common.validation';
import { IsUndefined } from '../../shared/validators/is-undefined.validator';
import { SERVICE_TYPE } from './services.enum';

export class VBusinessHours {
    @IsOptional() @IsMilitaryTime({ message: "$value is not a valid value for time format HH:MM"})
    opening: string;

    @IsOptional() @IsMilitaryTime({ message: "$value is not a valid value for time format HH:MM"})
    closing: string;
}

export class VOpeningHours {
    @IsOptional() @ValidateNested() @Type(() => VBusinessHours)
    monday: VBusinessHours;

    @IsOptional() @ValidateNested() @Type(() => VBusinessHours) 
    tuesday: VBusinessHours;

    @IsOptional() @ValidateNested() @Type(() => VBusinessHours) 
    wednesday: VBusinessHours;

    @IsOptional() @ValidateNested() @Type(() => VBusinessHours) 
    thursday: VBusinessHours;

    @IsOptional() @ValidateNested() @Type(() => VBusinessHours) 
    friday: VBusinessHours;

    @IsOptional() @ValidateNested() @Type(() => VBusinessHours) 
    saturday: VBusinessHours;

    @IsOptional() @ValidateNested() @Type(() => VBusinessHours) 
    sunday: VBusinessHours;
}

export class VSaveService {
    @IsDefined() @IsIn(_.values(SERVICE_TYPE))
    type: SERVICE_TYPE;

    @IsDefined() @IsString()
    name: string;

    @IsDefined()  @ValidateNested() @Type(() => VSaveLocation)
    location: any;

    @IsDefined() @IsPhoneNumber('US')
    phone: string;

    @IsDefined() @IsEmail()
    email: string;

    @IsDefined() @ValidateNested() @Type(() => VOpeningHours) 
    openingHours: VOpeningHours;

    @IsDefined() @IsString()
    description: string;

    @IsOptional() @IsDateString()
    createDate: Date;

    @IsOptional() @ValidateNested() @Type(() => VSaveImage)
    image: VSaveImage;

    @IsDefined() @IsString()
    street: string;

    @IsDefined() @IsString()
    post: string;
}

export class VServiceUpdate {
    @IsOptional() @IsIn(_.values(SERVICE_TYPE))
    type: SERVICE_TYPE;

    @IsOptional() @IsString()
    name: string;

    @IsOptional() @Type(() => VSaveLocation) @ValidateNested()
    location: any;

    @IsOptional() @IsPhoneNumber('US')
    phone: string;

    @IsOptional() @IsEmail()
    email: string;

    @IsOptional() @ValidateNested() @Type(() => VOpeningHours) 
    openingHours: VOpeningHours;

    @IsOptional() @IsString()
    description: string;

    @IsOptional() @IsDateString()
    createDate: Date;

    @IsOptional() @ValidateNested() @Type(() => VSaveImage)
    image: VSaveImage;

    @IsOptional() @IsString()
    street: string;

    @IsOptional() @IsString()
    post: string;
}

export class VServiceQuery {
    @IsOptional() @IsIn(_.values(SERVICE_TYPE))
    type: SERVICE_TYPE;

    @IsOptional() @IsString()
    name: string;

    @IsOptional() @Type(() => VSaveLocation) @ValidateNested() 
    @Transform((location) => GeoUtil.locationToGeoJSONPoint(location))
    location: any;

    @IsOptional() @IsPhoneNumber('US')
    phone: string;

    @IsOptional() @IsEmail()
    email: string;

    @IsOptional() @ValidateNested() @Type(() => VOpeningHours) 
    openingHours: VOpeningHours;

    @IsOptional() @IsString()
    description: string;

    @IsUndefined() @IsNumber()
    range?: number;

    @IsOptional() @IsDateString()
    createDate: Date;

    @IsOptional() @ValidateNested() @Type(() => VSaveImage)
    image: VSaveImage;
}

export class VServiceNearQuery {
    @IsOptional() @IsIn(_.values(SERVICE_TYPE))
    type?: SERVICE_TYPE;

    @IsDefined() @ValidateNested() @Type(() => VSaveLocation) 
    location: VSaveLocation;

    toPlainObject() {
        return Object.assign({}, this);
    }
}