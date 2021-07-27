import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConstantsStateService } from '../../states/constants/constants-state.service';
import { map, tap } from 'rxjs/operators';
import { InvoiceNote } from '../../components/billing/billable/class/invoice-note';
import { InvoiceTaxNumber } from '../../components/billing/billable/class/invoice-tax-number';
import { InvoiceLock } from '../../components/billing/billable/class/invoice-lock';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
@Injectable({
  providedIn: 'root'
})
export class BillableService {

  private apiUrl = environment.apiUrl;

  /**
   * Device api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
    private constantsStateService: ConstantsStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService
  ) { }

  public deleteDiscount(lockId) {
    return this.http.delete(this.apiUrl + `invoice/removeDiscount/${lockId}`);
  }
  public addDiscount(lockId, data) {
    return this.http.post(this.apiUrl + `invoice/addDiscount/${lockId}`, data);
  }
  public create(lockId, isSend, contactId, addressId) {
    return this.http.get(this.apiUrl + `/invoice/create/${lockId}?isSendNotification=${isSend}&billTo=${contactId}&shipTo=${addressId}`).pipe(
      tap(data => {
        this.toastrService.success("The billable item has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public unlock(lockId) {
    return this.http.get(this.apiUrl + `invoice/unlock/${lockId}`);
  }
  public getBillable() {
    return this.http.get(this.apiUrl + `billable/billablePageInfo`);
  }
  public updateInvoiceData(lockId, data) {
    return this.http.post(this.apiUrl + `invoice/partialUpdate/${lockId}`, data);
  }
  public getInvoiceNote() {
    return this.http.get(this.apiUrl + `invoice/invoiceNote/getAll`).pipe(map((data: any) => data.map(item => new InvoiceNote(item))));
  }
  public getTaxNumber() {
    return this.http.get(this.apiUrl + `settings/emailPages/taxNumber`).pipe(map((data: any) => new InvoiceTaxNumber(data)));
  }
  public editTaxNumber(data) {
    return this.http.put(this.apiUrl + `settings/emailPages/taxNumber`, data);
  }
  public getActualNumber() {
    return this.http.get(this.apiUrl + `data/actualNumber?type=INVOICE`);
  }
  public getInvoiceLock(ids) {
    return this.http.post(this.apiUrl + `invoice/lock`, ids).pipe(map((data: any) => new InvoiceLock(data)));

  }
  public getInvoiceLockTime(id) {
    return this.http.get(this.apiUrl + `invoice/lock/timeToUnlock/${id}`);
  }
}
