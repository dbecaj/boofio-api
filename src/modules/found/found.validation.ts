import { Transform, Type } from 'class-transformer';
import { IsDateString, IsDefined, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';

import { GeoUtil } from '../../shared/utils/geo.util';
import { VSaveLocation } from '../../shared/validators/common.validation';
import { IsUndefined } from '../../shared/validators/is-undefined.validator';
import { PET_TYPE } from '../pets/pets.enum';

export class VSaveFound {
    @IsDefined() @IsIn(_.values(PET_TYPE))
    petType: PET_TYPE;

    @IsOptional() @IsString()
    name?: string;

    @IsDefined() @IsString()
    description: string;

    @IsDefined() @IsDateString()
    date: Date;

    @IsDefined() @Type(() => VSaveLocation) @ValidateNested()
    location: any;
}

export class VUpdateFound {
    @IsOptional() @IsIn(_.values(PET_TYPE))
    petType: PET_TYPE;

    @IsOptional() @IsString()
    name?: string;

    @IsOptional() @IsString()
    description: string;

    @IsOptional() @IsDateString()
    date: Date;

    @IsOptional() @Type(() => VSaveLocation) @ValidateNested()
    location: any;
}

export class VFoundQuery {
    @IsOptional()
    userId: mongoose.Types.ObjectId;

    @IsOptional() @IsIn(_.values(PET_TYPE))
    petType: PET_TYPE;

    @IsOptional() @IsString()
    name?: string;

    @IsOptional() @IsString()
    description: string;

    @IsOptional() @IsDateString()
    date: Date;

    @IsOptional() @Type(() => VSaveLocation) @ValidateNested()
    @Transform((location) => GeoUtil.locationToGeoJSONPoint(location))
    location: any;
}