import { Type, Transform } from 'class-transformer';
import { IsDateString, IsDefined, IsIn, IsInstance, IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';

import { VSavePayment } from '../../shared/validators/common.validation';
import { IsUndefined } from '../../shared/validators/is-undefined.validator';
import { PURCHASE_TYPE } from './purchase.entity';

export class VSavePurchase {
    type: PURCHASE_TYPE;

    @IsDefined() @IsDateString()
    expireDate: Date;
}

export class VSavePurchaseService extends VSavePurchase {
    // Force type to be purchase type service with transform
    @IsOptional() @Transform(() => PURCHASE_TYPE.SERVICE)
    type = PURCHASE_TYPE.SERVICE;
    
    @IsOptional() @ValidateNested() @Type(() => VSavePayment)
    range?: VSavePayment;
}

export class VSavePurchaseAd extends VSavePurchase {
    // Force type to be purchase type service with transform
    @IsOptional() @Transform(() => PURCHASE_TYPE.AD)
    type = PURCHASE_TYPE.AD;

    @IsOptional() @ValidateNested() @Type(() => VSavePayment)
    range?: VSavePayment;

    @IsOptional() @ValidateNested() @Type(() => VSavePayment) 
    duration?: VSavePayment;
}

export class VSavePurchaseLost extends VSavePurchase {
    // Force type to be purchase type service with transform
    @IsOptional() @Transform(() => PURCHASE_TYPE.LOST)
    type = PURCHASE_TYPE.LOST;

    @IsOptional() @ValidateNested() @Type(() => VSavePayment)
    range?: VSavePayment;

    @IsOptional() @ValidateNested() @Type(() => VSavePayment) 
    duration?: VSavePayment;
}