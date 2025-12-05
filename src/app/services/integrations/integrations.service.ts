import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsService {


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

  public getSettings() {
    return this.http.get(`${this.apiUrl}moneris/settings`).pipe(
      tap((data: any) => {
        if (data.connected == true) this.toastrService.success("The connection has been established successfully");
        if (data.connected == false) this.toastrService.error("The connection cannot be established");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public setSettings(data) {
    return this.http.post(`${this.apiUrl}moneris/settings`, data);
  }
}
