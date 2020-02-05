// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
//
// @Injectable()
// export class ApiInterceptor implements HttpInterceptor {
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//
//     if (req.url.includes('jsonplaceholder.typicode.com')) {
//       const paramReq = req.clone({
//         params: req.params.set(
//           'userId',
//           '7'
//         )
//       });
//       return next.handle(paramReq);
//     } else {
//       return next.handle(req);
//     }
//
//     console.log('ppppppp');
//
//   }
// }
