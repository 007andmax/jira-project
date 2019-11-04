import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimeZoneService {
  private apiUrl = environment.apiUrl;
  public constructor(
    private http: HttpClient
  ) {}

  public getTimeZones() {
    return this.http.get(this.apiUrl + 'addresses/getGroupedLocales'); 
  }
}
