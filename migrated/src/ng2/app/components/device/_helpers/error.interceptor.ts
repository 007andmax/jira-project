import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionTimeoutComponent } from './../session-timeout/session-timeout.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) { }

intercept(request: HttpRequest < any >, next: HttpHandler): Observable < HttpEvent < any >> {
  return next.handle(request).pipe(catchError(err => {
    if (err.status === 401) {
      // this.modalRef = this.modalService.show(
      //   SessionTimeoutComponent,
      //   Object.assign({}, { class: 'remote-control modal-dialog-centered session', backdrop: true })
      // );
    } else if (err.status === 423) {
      // this.modalRef = this.modalService.show(
      //   LockScreenComponent,
      //   Object.assign({}, { class: 'remote-control modal-dialog-centered session', backdrop: true })
      // );
    }
    const error = err.error || err.statusText;
    return throwError(error);
  }));
}
}
