import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiPasswordManagerService {

  public apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRecords() {
    console.log('00000');
    return this.http.get(this.apiUrl+'/passwordRecords')
      .pipe(tap(res => res))
  }
}
