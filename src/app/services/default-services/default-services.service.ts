import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DefaultServices } from '../../components/billing/default-services/class/default-service';
import { map, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';

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
    private toastrService: ToastrService,
    private appStateService: AppStateService

  ) { }
  public searchDuplicatedServiceNames(startDate, endDate, companyId, agreementId, serviceNamesList) {
    return this.http.post(this.apiUrl + `services/searchDuplicatedServiceNames?startDate=${startDate}&endDate=${endDate}&companyId=${companyId + ((agreementId) ? '&agreementId=' + agreementId : '')}`, serviceNamesList);
  }
  public getDefaultServices() {
    return this.http.get(this.apiUrl + `services/getDefaultServices`).pipe(map((data: any) => data.map(item => new DefaultServices(item))));
  }
  public getDefaultService(service_id) {
    return this.http.get(this.apiUrl + `services/${service_id}/view`).pipe(map((data: any) => new DefaultServices(data)));
  }
  public changeBillableStatus(id, status) {
    return this.http.post(this.apiUrl + `services/changeBillableStatus?id=${id}&toBillable=${status}`, {});
  }
  public changeService(data) {

    return this.http.put(this.apiUrl + `services/${data.id}`, data).pipe(
      tap(data => {
        this.toastrService.success("The service has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public addService(data) {

    return this.http.post(this.apiUrl + `services`, data).pipe(
      tap(data => {
        this.toastrService.success("The new service has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public deleteService(id) {

    return this.http.delete(this.apiUrl + `services/${id}`).pipe(
      tap(data => {
        this.toastrService.success("The service has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
}
