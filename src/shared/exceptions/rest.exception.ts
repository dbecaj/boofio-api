import { HttpStatus, InternalServerErrorException } from '@nestjs/common';

// Client exceptions

export class BadRequestException extends Error {
    httpStatus = HttpStatus.BAD_REQUEST;
    code = 0;
    error = 'BAD_REQUEST';
    message = 'Unknown error';
    errors = {};
    data = undefined;

    constructor(message?: string) {
      super();
      this.message = message || this.message;
    }
  }

export class CastException extends BadRequestException {
  httpStatus = HttpStatus.NOT_ACCEPTABLE;
  code = 1;  
  error = 'CAST_ERROR';

  constructor(field: string, castType: string, data?) {
    super();
    this.message = `Field ${field} could not be cast to ${castType}`;
    this.errors = data || 'CAST_ERROR';
  }
}

export class NotFoundException extends BadRequestException {
  httpStatus = HttpStatus.NOT_FOUND;
  code = 2;
  error = 'NOT_FOUND_ERROR';

  constructor(object?: string) {
    super();
    this.message = `${object} not found`;
  }
}

export class AlreadyExistsException extends BadRequestException {
  httpStatus = HttpStatus.CONFLICT;
  code = 3;
  error = 'ALREADY_EXISTS_ERROR';

  constructor(object?: string) {
    super();
    this.message = `${object} already exists`;
  }
}

export class ValidationErrorException extends BadRequestException {
  httpStatus = HttpStatus.NOT_ACCEPTABLE;
  code = 4;
  error = 'VALIDATION_ERROR';

  constructor(errors) {
    super();
    this.message = `Validation error: ${errors[0]}`;
    this.errors = errors;
  }
}

export class EmailExistsException extends BadRequestException {
  code = 5;
  error = 'EMAIL_EXISTS_ERROR';

  constructor(email: string) {
    super();
    this.message = `Email ${email} already registered`;
  }
}

export class ForbiddenException extends BadRequestException {
  httpStatus = HttpStatus.FORBIDDEN;
  code = 6;
  message = 'Forbidden';

  constructor(message?: string) {
    super();
    this.message = message || 'Forbidden';
  }
}

export class MissingException extends BadRequestException {
  httpStatus = HttpStatus.NOT_FOUND;
  code = 7;
  error = 'MISSING_ERROR';

  constructor(object?: string) {
    super();
    this.message = `${object} missing`;
  }
}

export class ConflictException extends BadRequestException {
  httpStatus = HttpStatus.CONFLICT;
  code = 8;
  error = 'CONFLICT_ERROR';

  constructor(message?: string) {
    super();
    this.message = message;
  }
}

export class AlreadyAssignedException extends BadRequestException {
  httpStatus = HttpStatus.CONFLICT;
  code = 10;
  error = 'ALREADY_ASSIGNED_ERROR';

  constructor(object?: string) {
    super();
    this.message = `${object} already assigned`;
  }
}

// Internal server exceptions

export class InternalServerException extends Error {
  httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
  code = 9;
  error = 'INTERNAL_SERVER_ERROR';
  message = 'Unknown error';
  errors = {};
  data = undefined;

  constructor(message?: string) {
    super();
    this.message = message || this.message;
  }
}

export class NotImplementedException extends InternalServerException {
  httpStatus = HttpStatus.NOT_IMPLEMENTED;
  code = 10;
  error = 'NOT_IMPLEMENTED_ERROR';

  constructor(object?: string) {
    super();
    this.message = `${object} not implemented`;
  }
}

export class NotProcessedException extends InternalServerException {
  httpStatus = HttpStatus.NOT_IMPLEMENTED;
  code = 11;
  error = 'NOT_PROCESSED_ERROR';

  constructor(object?: string) {
    super();
    this.message = `${object} is not processed`;
  }
}

export class DataIntegrityException extends InternalServerException {
  code = 12;
  error = 'DATA_INTEGRITY_ERROR'

  constructor(message?: string) {
    super();
    this.message = message;
  }
}

export class FileIntegrityException extends InternalServerException {
  code = 13;
  error = 'FILE_INTEGRITY_ERROR';

  constructor(message?: string) {
    super();
    this.message = message;
  }
}

export class FileDeleteException extends InternalServerException {
  code = 14;
  error = 'FILE_DELETE_ERROR';

  constructor(filename?: string) {
    super();
    this.message = `${filename} could not be deleted`;
  }
}