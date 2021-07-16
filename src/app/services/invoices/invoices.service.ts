import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Invoice } from '../../components/billing/invoices/class/invoice';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  private apiUrl = environment.apiUrl;

  /**
   * Product api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService

  ) { }
  public createPayment(data) {
    return this.http.post(`${this.apiUrl}receivable/receivePayment`, data).pipe(
      tap(data => {
        this.toastrService.success("The payment has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public resendInvoices(invoiceIds) {
    return this.http.post(`${this.apiUrl}receivable/resend`, { ids: invoiceIds }).pipe(
      tap(data => {
        this.toastrService.success("The invoice has been successfully sent");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public getInvoice(invoiceId) {
    return this.http.get(`${this.apiUrl}invoice/getDataByInvoiceId?invoiceId=${invoiceId}`);
  }
  public rollback(invoiceId) {
    return this.http.put(`${this.apiUrl}invoice/rollback?invoiceId=${invoiceId}`, {}).pipe(
      tap(data => {
        this.toastrService.success("The invoice has been successfully rollbacked");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public remove(invoiceId) {
    return this.http.delete(`${this.apiUrl}invoice/delete?invoiceId=${invoiceId}`, {});
  }
  public markAsRead(invoiceId) {
    return this.http.post(`${this.apiUrl}invoice/${invoiceId}/markAsRead`, {});
  }
  public resendArchiveInvoices(invoiceIds) {
    return this.http.post(`${this.apiUrl}receiptArchive/resend`, { ids: invoiceIds });
  }
  public getInvoices(data) {
    return this.http.post(`${this.apiUrl}receivable`, data).pipe(map((res: any) => res.map(item => new Invoice(item))));
  }
}
