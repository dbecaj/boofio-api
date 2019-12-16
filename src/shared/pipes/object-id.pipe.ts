import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CastException } from '../exceptions/rest.exception'
import * as mongoose from 'mongoose';

export function castToObjectId(str: string, field: string) {
  if (!mongoose.Types.ObjectId.isValid(str))
    throw new CastException(field, 'mongo id', str);
  return new mongoose.Types.ObjectId(str);
}

@Injectable()
export class ObjectIdPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    return castToObjectId(value, metadata.data)
  }
}
