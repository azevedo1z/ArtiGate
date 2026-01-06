export class AppException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppException';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConflictException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictException';
  }
}

export class NotFoundException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}

export class ValidationException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedException';
  }
}
