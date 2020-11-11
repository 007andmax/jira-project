import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DefaultServices } from '../../components/billing/default-services/class/default-service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DefaultServicesService {

  private apiUrl = environment.apiUrl;
 
  /**
   * Device api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
   
  ) { }
  public searchDuplicatedServiceNames(startDate, endDate, companyId, agreementId,serviceNamesList) {
    return this.http.post(this.apiUrl + `services/searchDuplicatedServiceNames?startDate=${startDate}&endDate=${endDate}&companyId=${companyId + ((agreementId) ? '&agreementId=' + agreementId : '')}`,serviceNamesList);
  }
  public getDefaultServices(){
    return this.http.get(this.apiUrl + `services/getDefaultServices`).pipe(map((data: any) => data.map(item => new DefaultServices(item))));
  }
  
  public changeBillableStatus(id,status){
    return this.http.post(this.apiUrl + `services/changeBillableStatus?id=${id}&toBillable=${status}`,{});
  }
  public changeService(data){
   
    return this.http.put(this.apiUrl + `services/${data.id}`,data);
  }
  public addService(data){
   
    return this.http.post(this.apiUrl + `services`,data);
  }
  public deleteService(id){
   
    return this.http.delete(this.apiUrl + `services/${id}`);
  }
}
