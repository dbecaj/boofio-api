import { IsDateString, IsDefined, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import * as mongoose from 'mongoose';

import { IsUndefined } from './is-undefined.validator';

export class VSaveLocation {
    @IsOptional() @IsString()
    address: string;

    @IsDefined() @IsNumber()
    lat: number;

    @IsDefined() @IsNumber()
    lon: number;
}

export class VSaveImage {
    @IsDefined() @IsUrl({ require_tld: false })
    thumb: string;

    @IsDefined() @IsUrl({ require_tld: false })
    small: string;
}

export class VSavePayment {
    @IsOptional() @IsDateString()
    date?: Date;

    @IsDefined() @IsString()
    paymentId: string;

    @IsDefined() @IsNumber()
    ammount: number;
}