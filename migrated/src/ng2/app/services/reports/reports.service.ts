import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient ) { }

  public getPdfUrl(data) {
    return this.http.post(this.apiUrl + `reports/pdf`, data);
    
  }
  public getCustomPdfUrl(data) {
    return this.http.post(this.apiUrl + `customerReport/pdf`, data);
    
  }

  public getAccountingStartDate () {
    return this.http.get(this.apiUrl + `settings/companyProfile/accountingStartDate`);
  }
  public getReportByGlNumber(data) {
    return this.http.post(this.apiUrl + `reports/sales/byGlNumber`, data);
  }
  public getReportSalesByProducts(data) {
    return this.http.post(this.apiUrl + `reports/sales/byProducts`, data);
  }
  public getReportByTaxes(data) {
    return this.http.post(this.apiUrl + `reports/sales/byTaxes`, data);
  }
  public getReportByAccountsReceivable(data) {
    return this.http.post(this.apiUrl + `reports/sales/byReceivable`, data);
  }
  public getReportByProduct(data) {
    return this.http.post(this.apiUrl + `reports/sales/byProducts`, data);
  }
  public getReportByCustomers(data) {
    return this.http.post(this.apiUrl + `reports/sales/byCustomers`, data);
  }
  public getReportByTickets(data) {
    return this.http.post(this.apiUrl + `customerReport`, data);
  }
  public sendMessage (data) {
    return this.http.post(this.apiUrl + `reports/email`, data);
  }
  public sendCustomerMessage (data) {
    return this.http.post(this.apiUrl + `customerReport/email`, data);
  }
}
