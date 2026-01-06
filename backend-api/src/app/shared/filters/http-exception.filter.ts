import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ConflictException,
  NotFoundException,
  ValidationException,
  UnauthorizedException,
} from '../exceptions/app.exception';

interface ErrorResponse {
  status: HttpStatus;
  message: string;
  error: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  private readonly customExceptionMap = new Map<
    new (...args: never[]) => Error,
    { status: HttpStatus; error: string }
  >([
    [ConflictException, { status: HttpStatus.CONFLICT, error: 'Conflict' }],
    [NotFoundException, { status: HttpStatus.NOT_FOUND, error: 'Not Found' }],
    [
      ValidationException,
      { status: HttpStatus.BAD_REQUEST, error: 'Validation Error' },
    ],
    [
      UnauthorizedException,
      { status: HttpStatus.UNAUTHORIZED, error: 'Unauthorized' },
    ],
  ]);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const errorResponse = this.getErrorResponse(exception, request);

    response.status(errorResponse.status).json({
      statusCode: errorResponse.status,
      message: errorResponse.message,
      error: errorResponse.error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getErrorResponse(
    exception: unknown,
    request: Request
  ): ErrorResponse {
    for (const [ExceptionClass, config] of this.customExceptionMap) {
      if (exception instanceof ExceptionClass) {
        return {
          status: config.status,
          message: exception.message,
          error: config.error,
        };
      }
    }

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      return {
        status: exception.getStatus(),
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as { message?: string }).message ||
              exception.message,
        error: exception.name,
      };
    }

    if (exception instanceof Error) {
      this.logger.error(
        `Unexpected error: ${exception.message}`,
        exception.stack,
        `${request.method} ${request.url}`
      );
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred',
        error: 'Internal Server Error',
      };
    }

    this.logger.error(
      'Unknown error type',
      JSON.stringify(exception),
      `${request.method} ${request.url}`
    );
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    };
  }
}
