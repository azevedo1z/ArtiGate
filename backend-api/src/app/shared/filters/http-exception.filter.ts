import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MulterError } from 'multer';
import { Prisma } from '@prisma/client';
import {
  ConflictException,
  NotFoundException,
  ValidationException,
  UnauthorizedException,
  PaymentGatewayException,
  PaymentRequiredException,
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
    [
      PaymentGatewayException,
      { status: HttpStatus.BAD_GATEWAY, error: 'Payment Gateway Error' },
    ],
    [
      PaymentRequiredException,
      { status: HttpStatus.PAYMENT_REQUIRED, error: 'Payment Required' },
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

    if (exception instanceof MulterError) {
      const isFileSizeLimit = exception.code === 'LIMIT_FILE_SIZE';

      return {
        status: isFileSizeLimit
          ? HttpStatus.PAYLOAD_TOO_LARGE
          : HttpStatus.BAD_REQUEST,
        message: isFileSizeLimit
          ? 'Uploaded file is larger than the allowed limit.'
          : `File upload rejected: ${exception.message}`,
        error: 'Upload Rejected',
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.mapPrismaError(exception, request);
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

  private mapPrismaError(
    error: Prisma.PrismaClientKnownRequestError,
    request: Request
  ): ErrorResponse {
    switch (error.code) {
      case 'P2002': {
        const target = Array.isArray(error.meta?.target)
          ? (error.meta?.target as string[]).join(', ')
          : ((error.meta?.target as string | undefined) ?? 'field');
        return {
          status: HttpStatus.CONFLICT,
          message: `A record with the same ${target} already exists.`,
          error: 'Conflict',
        };
      }
      case 'P2003': {
        const reference = this.formatForeignKeyReference(error.meta);
        return {
          status: HttpStatus.BAD_REQUEST,
          message: reference
            ? `Invalid reference: ${reference} does not exist.`
            : 'Invalid reference: a related record does not exist.',
          error: 'Validation Error',
        };
      }
      case 'P2025': {
        const cause = error.meta?.cause as string | undefined;
        return {
          status: HttpStatus.NOT_FOUND,
          message: cause ?? 'The requested record was not found.',
          error: 'Not Found',
        };
      }
      default: {
        this.logger.error(
          `Unhandled Prisma error ${error.code}: ${error.message}`,
          error.stack,
          `${request.method} ${request.url}`
        );
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'A database error occurred.',
          error: 'Database Error',
        };
      }
    }
  }

  private formatForeignKeyReference(
    meta: Prisma.PrismaClientKnownRequestError['meta']
  ): string | null {
    const raw =
      (meta?.field_name as string | undefined) ??
      (meta?.constraint as string | undefined);
    if (!raw) return null;

    const match = raw.match(/^([A-Za-z][A-Za-z0-9]*)_([A-Za-z][A-Za-z0-9]*)_fkey/);
    if (match) return `${match[1]}.${match[2]}`;

    return raw.replace(/\s*\(index\)\s*$/, '');
  }
}
