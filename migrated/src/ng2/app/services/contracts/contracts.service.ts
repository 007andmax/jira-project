import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ContractItem } from '../../components/billing/contracts/class/contract-item';
import { ServiceAgreement } from '../../components/billing/contracts/class/service-agreement';

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
    private http: HttpClient
  ) {}
  
  public terminate( id) {
    return this.http.put(this.apiUrl + `serviceAgreements/terminate/${id}`,{});
  }
  public getServiceAgreement( agreementId) {
    return this.http.get(this.apiUrl + `/serviceAgreements/${agreementId}`).pipe(map((data: any) => new ServiceAgreement(data)));
  }
  public createContract(createBillableItem, data) {
    return this.http.post(this.apiUrl + `serviceAgreements?createBillableItem=${createBillableItem}`,data);
  }
  public updateContract( data) {
    return this.http.put(this.apiUrl + `serviceAgreements`,data);
  }
  public validateCrossingDatesHourly(startDate, endDate, companyId,agreementId) {
    return this.http.get(this.apiUrl + `/serviceAgreements/validateCrossingDates?companyId=${companyId}&startDate=${startDate}&endDate=${endDate + ((agreementId) ? '&agreementId=' + agreementId : '')}`);
  }
  public getServiceAgreements() {
    return this.http.get(this.apiUrl + 'serviceAgreements').pipe(map((data: any) => data.map(item => new ContractItem(item))));
  }
}
