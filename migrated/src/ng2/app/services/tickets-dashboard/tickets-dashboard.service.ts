import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketsDashboardService {
  private apiUrl = environment.apiUrl;
  public constructor(
    private http: HttpClient,
  ) { }

  public getResponseTime(startDate,endDate) {
    return this.http.get(this.apiUrl + `dashboard/ticket/responseTime?startDate=${startDate}&endDate=${endDate}`);
  }
}
