import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable, map } from 'rxjs';

export class SerializerInterceptor implements NestInterceptor {
  // dto is the variable. so you can use this class for different entities
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // you can write some code to run before request is handled
    return handler.handle().pipe(
      map((data: any) => {
        return plainToClass(this.dto, data, {
          //   this takes care of everything. this will expose things that are set in the Dto
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
