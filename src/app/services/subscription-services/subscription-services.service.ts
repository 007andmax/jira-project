import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'd3';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { NonContractServices } from 'src/app/components/billing/non-contract-services/class/non-contract-service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionServicesService {

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

  public getServices() {
    return this.http.get(this.apiUrl + `subscriptionServices`);
  }
  public addService(data) {
    return this.http.post(this.apiUrl + `subscriptionServices`, data).pipe(
      tap(data => {
        this.toastrService.success("The new service has been successfully uploaded");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
}
