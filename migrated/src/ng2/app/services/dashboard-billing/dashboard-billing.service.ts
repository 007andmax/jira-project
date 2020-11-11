import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/ng2/environments/environment';
import { Dashboard } from '../../components/billing/dashboard-billing/class/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardBillingService {

  private apiUrl = environment.apiUrl;

  /**
   * Companies api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient
  ) { }

  public getDashboard(frequency) {
    return this.http.get(this.apiUrl + `dashboard/accounting?frequency=${frequency}`).pipe(map((data: any) => new Dashboard(data)));
  }
  public getInvoiceRevenue(data) {
    return this.http.post(this.apiUrl + `reports/sales/invoiceRevenue`, data);
  }
  public getTops(data) {
    return this.http.post(this.apiUrl + `reports/sales/top5`, data);
  }
}
