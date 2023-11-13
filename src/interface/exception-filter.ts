import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error(exception.message, exception.stack);
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any;

    switch (exception.getStatus()) {
      case 11000:
        status = 400;
        errorResponse = ['Duplicate Record'];
        break;

      case 401:
        status = exception.getStatus();
        errorResponse = ['Unauthorized'];
        break;

      case 422:
        status = exception.getStatus();
        const error422 =
          exception['response']['message'] || exception['response'];
        errorResponse = isArray(error422) ? error422 : [error422];
        break;

      case 500:
        status = exception.getStatus();
        console.error(`Exception Occurs  => ${exception}`);
        errorResponse = ['Internal Server Error'];
        break;

      case 400:
      case 403:
      case 404:
        status = exception.getStatus();
        const errorCommon =
          exception['response']['message'] || exception['response'];
        errorResponse = isArray(errorCommon) ? errorCommon : [errorCommon];
        break;

      default:
        // Handle any other status codes here, if needed.
        break;
    }

    response.status(status).json({
      success: false,
      error: errorResponse,
    });
  }
}
