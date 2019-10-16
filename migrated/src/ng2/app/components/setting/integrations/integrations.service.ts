import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/ng2/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  settings(): Observable<any> {
    return this.http.get(`${this.apiUrl}ps/settings`).pipe(map(data => data));
  }

  savePaymentInfo(data: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}ps/settings`, data)
      .pipe(map(data => data));
  }
}
