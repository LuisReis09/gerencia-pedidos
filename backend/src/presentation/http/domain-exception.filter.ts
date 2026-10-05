import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ConflictError, DomainError, InvalidDataError, ProductWithoutCostError, ResourceNotFoundError } from '../../domain/errors/domain.error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = this.statusFor(exception);
    response.status(status).json({ statusCode: status, code: exception.code, message: exception.message });
  }

  private statusFor(exception: DomainError): number {
    if (exception instanceof ResourceNotFoundError) return HttpStatus.NOT_FOUND;
    if (exception instanceof ConflictError) return HttpStatus.CONFLICT;
    if (exception instanceof ProductWithoutCostError) return HttpStatus.UNPROCESSABLE_ENTITY;
    if (exception instanceof InvalidDataError) return HttpStatus.BAD_REQUEST;
    return HttpStatus.BAD_REQUEST;
  }
}
