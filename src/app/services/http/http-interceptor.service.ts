import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { empty, NEVER, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { environment } from 'src/environments/environment';
import { AppService } from '../../states/app/app.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private appService: AppService,
    private toastrService: ToastrService,
    private appStateService: AppStateService

  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes(environment.apiAgent)) return NEVER; // block agent requests
    return next.handle(req).pipe(
      tap(
        (event) => {
          let isDisabled = (req.body && req.body.data) ? req.body.data.message === 'userDisabled' : false;
          if (isDisabled) this.appService.showSessionScreen('Your account has been disabled.')
        },
        (err) => {
          if (err instanceof HttpErrorResponse) {
            let unlockExpiredHeader = err.headers.get('SESSION_UNLOCK_EXPIRED');
            let isUnauthorized = (err.error) ? err.error.errorMessage === 'unauthorized' || err.error.authMessage === 'unauthorized' : false;
            if (unlockExpiredHeader && unlockExpiredHeader.toLocaleLowerCase() === 'true' || isUnauthorized) {
              this.appService.showSessionScreen('You have been away for more than 3 hours. You have been logged off. Please login again.');
              return;
            }
            if (err.status == 423) {
              this.appService.showLockScreen(true);
              return;
            }
          }
          if (err.status >= 400 && err.status < 500 && err.error && err.error.message) this.toastrService.error("Something went wrong", err.error.message);
          if (err.status >= 500 && err.status < 600) {
            if (err.error && err.error.message && err.error.message.includes("To close ticket all expenses")) {
              this.toastrService.error(err.error.message, "Server error");
            } else {
              this.toastrService.error("Something went wrong", "Server error");
            }
          }
          this.appStateService.changeDetectorRef();
        }
      )
    )
  }
}
