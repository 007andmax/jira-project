import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SessionTimeoutComponent } from './../session-timeout/session-timeout.component';
import { LockScreenComponent } from '../lock-screen/lock-screen.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  modalRef: BsModalRef;
  constructor(private router: Router, private toastr: ToastrService,
    private modalService: BsModalService) { }

intercept(request: HttpRequest < any >, next: HttpHandler): Observable < HttpEvent < any >> {
  return next.handle(request).pipe(catchError(err => {
    if (err.status === 401) {
      this.modalRef = this.modalService.show(
        SessionTimeoutComponent,
        Object.assign({}, { class: 'remote-control modal-dialog-centered session', backdrop: true })
      );
    } else if (err.status === 423) {
      this.modalRef = this.modalService.show(
        LockScreenComponent,
        Object.assign({}, { class: 'remote-control modal-dialog-centered session', backdrop: true })
      );
    }
    const error = err.error || err.statusText;
    return throwError(error);
  }));
}
}
