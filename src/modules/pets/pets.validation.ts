import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsDefined,
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    ValidateNested,
    IsMongoId,
} from 'class-validator';
import * as _ from 'lodash';

import { GeoUtil } from '../../shared/utils/geo.util';
import { VSaveImage, VSaveLocation } from '../../shared/validators/common.validation';
import { IsUndefined } from '../../shared/validators/is-undefined.validator';
import { PET_TYPE } from './pets.enum';
import * as mongoose from 'mongoose';

export class VSaveLost {
    @IsDefined() @Type(() => VSaveLocation) @ValidateNested()
    location: any;

    @IsDefined() @IsString()
    description: string;

    @IsOptional() @IsDateString()
    date: Date;

    @IsDefined() @IsNumber()
    reward: number;

    @IsUndefined()
    expireDate: Date;

    @IsUndefined()
    range: number;
}

export class VUpdateLost {
    @IsOptional() @Type(() => VSaveLocation) @ValidateNested()
    location: any;

    @IsOptional() @IsString()
    description: string;

    @IsOptional() @IsDateString()
    date: Date;

    @IsOptional() @IsNumber()
    reward: number;

    @IsOptional() @IsBoolean()
    found: boolean;
}

export class VLostQuery {
    @IsOptional() @Type(() => VSaveLocation) @ValidateNested()
    @Transform((location) => GeoUtil.locationToGeoJSONPoint(location))
    location: any;

    @IsOptional() @IsString()
    description: string;

    @IsOptional() @IsDateString()
    date: Date;

    @IsOptional() @IsNumber()
    reward: number;

    @IsOptional() @IsNumber()
    range: number;

    @IsOptional() @IsBoolean()
    found: boolean;
}

export class VLostNearQuery {
    @IsDefined() @ValidateNested() @Type(() => VSaveLocation) 
    location: VSaveLocation;
}

export class VSavePet {
    @IsDefined() @IsIn(_.values(PET_TYPE))
    type: PET_TYPE;

    @IsDefined() @IsString()
    name: string;

    @IsDefined() @IsDateString()
    birthday: Date;

    @IsOptional() @ValidateNested() @Type(() => VSaveImage)
    image: VSaveImage;
}

export class VUpdatePet {
    @IsOptional() @IsIn(_.values(PET_TYPE))
    type: PET_TYPE;

    @IsOptional() @IsString()
    name: string;

    @IsOptional() @IsDateString()
    birthday: Date;

    @IsOptional() @ValidateNested() @Type(() => VSaveImage)
    image: VSaveImage;
}

export class VPetQuery {
    @IsOptional() @IsIn(_.values(PET_TYPE))
    type: PET_TYPE;

    @IsOptional() @IsString()
    name: string;

    @IsOptional() @IsDateString()
    birthday: Date;

    @IsOptional() @ValidateNested() @Type(() => VSaveImage)
    image: VSaveImage;
}