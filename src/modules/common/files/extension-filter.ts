import * as path from 'path';

import { ValidationErrorException } from '../../../shared/exceptions/rest.exception';

export function extensionFilter(allowedExtensions: string[]) {
  return {
    fileFilter: (req, file, cb) => {
      const originalExtension = path.extname(file.originalname).toLowerCase();

      if (allowedExtensions.indexOf(originalExtension) < 0) {
        const errors = ['Only following file types are allowed: ' + allowedExtensions.join(', ')];
        return cb(new ValidationErrorException(errors), false);
      }
    
      cb(null, true);
    }
  }
}