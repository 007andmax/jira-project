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
          if (event instanceof HttpResponse) console.log('Server response', req)
          let isDisabled = (req.body && req.body.data) ? req.body.data.message === 'userDisabled' : false;
          if (isDisabled) this.appService.showSessionScreen('Your account has been disabled.')
        },
        (err) => {
          if (err instanceof HttpErrorResponse) {

            let unlockExpiredHeader = err.headers.get('SESSION_UNLOCK_EXPIRED');
            let isUnauthorized = (err.error) ? err.error.errorMessage === 'unauthorized' || err.error.authMessage === 'unauthorized' : false;
            if (isUnauthorized) {
              this.appService.showSessionScreen('Your account has been disabled.')
              return;
            };
            if (unlockExpiredHeader && unlockExpiredHeader.toLocaleLowerCase() === 'true') {
              this.appService.showSessionScreen('You have been away for more than 3 hours. You have been logged off. Please login again.');
              return;
            }
            if (err.status == 423) this.appService.showLockScreen(true);
            //  console.log('Unauthorized')
          }
        }
      )
    )
  }
}
