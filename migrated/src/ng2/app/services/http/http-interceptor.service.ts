import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppService } from '../../states/app/app.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private appService: AppService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


    return next.handle(req).pipe(
      tap(
        (event) => {
          //  if (event instanceof HttpResponse)  //   console.log('Server response')

        },
        (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status == 423) {
              this.appService.showLockScreen();
            }
            //  console.log('Unauthorized')
          }
        }
      )
    )
  }
}
