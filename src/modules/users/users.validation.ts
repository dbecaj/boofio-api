import { Type } from 'class-transformer';
import { IsDefined, IsEmail, IsIn, IsOptional, IsPhoneNumber, IsString, ValidateNested, IsUrl } from 'class-validator';
import * as _ from 'lodash';

import { VSaveImage } from '../../shared/validators/common.validation';
import { IsUndefined } from '../../shared/validators/is-undefined.validator';
import { USER_ROLE } from './users.enum';

export class VRegisterUser {
    @IsDefined() @IsEmail()
    email: string;

    @IsDefined() @IsString()
    password: string;

    @IsOptional() @IsPhoneNumber('US') // TODO: Look for a way to cater to different regions
    phone: string;

    @IsOptional() @ValidateNested() @Type(() => VSaveImage)
    profileImage: VSaveImage;

    @IsUndefined()
    bookmarks: any;

    @IsOptional() @IsString()
    name: string;

    @IsOptional() @IsEmail()
    contactEmail: string;
}

export class VUpdateUser {
    @IsOptional() @IsEmail()
    contactEmail: string;

    @IsOptional() @IsString()
    name: string;

    @IsOptional() @IsPhoneNumber('US') // TODO: Look for a way to cater to different regions
    phone: string;

    @IsOptional() @ValidateNested() @Type(() => VSaveImage)
    profileImage: VSaveImage;

    @IsOptional() @IsIn(_.values(USER_ROLE))
    role: USER_ROLE;
}