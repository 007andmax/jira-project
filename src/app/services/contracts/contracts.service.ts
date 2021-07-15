import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { ContractItem } from '../../components/billing/contracts/class/contract-item';
import { ServiceAgreement } from '../../components/billing/contracts/class/service-agreement';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  private apiUrl = environment.apiUrl;

  /**
   * Companies api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService
  ) { }
  public forceCreate(id) {
    return this.http.get(this.apiUrl + `serviceAgreements/forceCreate?id=${id}`).pipe(
      tap(data => {
        this.toastrService.success("The billable item has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public delete(id) {
    return this.http.delete(this.apiUrl + `serviceAgreements/${id}`, {}).pipe(
      tap(data => {
        this.toastrService.success("The contract has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public terminate(id) {
    return this.http.put(this.apiUrl + `serviceAgreements/terminate/${id}`, {}).pipe(
      tap(data => {
        this.toastrService.success("The contract has been successfully terminated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public getServiceAgreement(agreementId) {
    return this.http.get(this.apiUrl + `/serviceAgreements/${agreementId}`).pipe(map((data: any) => new ServiceAgreement(data)));
  }
  public createContract(createBillableItem, data) {
    return this.http.post(this.apiUrl + `serviceAgreements?createBillableItem=${createBillableItem}`, data).pipe(
      tap(data => {
        this.toastrService.success("The new contract has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public updateContract(data) {
    return this.http.put(this.apiUrl + `serviceAgreements`, data).pipe(
      tap(data => {
        this.toastrService.success("The new contract has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public validateCrossingDatesHourly(startDate, endDate, companyId, agreementId) {
    return this.http.get(this.apiUrl + `/serviceAgreements/validateCrossingDates?companyId=${companyId}&startDate=${startDate}&endDate=${endDate + ((agreementId) ? '&agreementId=' + agreementId : '')}`);
  }
  public getServiceAgreements() {
    return this.http.get(this.apiUrl + 'serviceAgreements').pipe(map((data: any) => data.map(item => new ContractItem(item))));
  }
}
