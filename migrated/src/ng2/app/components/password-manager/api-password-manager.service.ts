import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiPasswordManagerService {

  constructor(private http: HttpClient) { }

  getRecords() {
    return this.http.get('/passwordRecords')
      .pipe(tap(res => res))
  }
}
