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
  public createInvoiceByCompanyId(data) {
    return this.http.post(this.apiUrl + `invoice/create/multiple?isSendNotification=true`, data).pipe(
      tap(data => {
        this.toastrService.success("The invoice has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public addDiscount(lockId, data) {
    return this.http.post(this.apiUrl + `invoice/addDiscount/${lockId}`, data);
  }
  public create(invoice) {
    return this.http.post(this.apiUrl + `/invoice/create`, invoice).pipe(
      tap(data => {
        this.toastrService.success("The invoice has been successfully created");
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
    return this.http.get(this.apiUrl + `invoice/notes`).pipe(map((data: any) => data.map(item => new InvoiceNote(item))));
  }
  public addNote(data) {
    return this.http.post(this.apiUrl + `invoice/notes`, data).pipe(
      tap(data => {
        this.toastrService.success("The new custom note has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }, err => {
        this.toastrService.error("The error has occurred, please check your entries");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public editNote(id, data) {
    return this.http.put(this.apiUrl + `invoice/notes/${id}`, data).pipe(
      tap(data => {
        this.toastrService.success("The custom note has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }, err => {
        this.toastrService.error("The error has occurred, please check your entries");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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
