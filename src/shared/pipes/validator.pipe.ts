import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { ValidationErrorException, BadRequestException } from '../exceptions/rest.exception';

@Injectable()
export class ValidatorPipe implements PipeTransform<any> {
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;
    if (!this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, { whitelist: true, skipMissingProperties: true });
    if (errors.length > 0) {
      let errorMessages = this.extractErrorMessages(errors);
      throw new ValidationErrorException(errorMessages);
    }

    return object;
  }

  private extractErrorMessages(errors) {
    if (!errors)
      return [];
    let r = [];
    errors.forEach(err => {
      if (err.constraints) Object.keys(err.constraints).forEach(key => r.push(err.constraints[key]));
      r = r.concat(this.extractErrorMessages(err.children));
    });
    return r;
  }

  private toValidate(metatype: any = null): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }
}

/*@Injectable()
export class ValidatorPipe implements PipeTransform<any> {
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;
    if (!this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object, { skipMissingProperties: true, whitelist: true });
    if (errors.length > 0) {
      let errorMessages = this.extractErrorMessages(errors);
      throw new ValidationErrorException(errorMessages);
    }
    return object;
  }

  private extractErrorMessages(errors) {
    let r = [];
    errors.forEach(err => {
      if (err.constraints)
        Object.keys(err.constraints).forEach(key => r.push(err.constraints[key]));
      r = r.concat(this.extractErrorMessages(err.children));
    });
    return r;
  }

  private toValidate(metatype: any = null): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}*/
