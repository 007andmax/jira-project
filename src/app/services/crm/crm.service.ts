import { HttpClient } from '@angular/common';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CrmService {

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
  public getIndustryList() {
    return this.http.get(this.apiUrl + `crm/settings/industry`);
  }
  public getJobTypeList() {
    return this.http.get(this.apiUrl + `crm/settings/jobType`);
  }
  public getServiceTypeList() {
    return this.http.get(this.apiUrl + `crm/settings/serviceType`);
  }
  public getJobTitleList() {
    return this.http.get(this.apiUrl + `crm/settings/jobTitle`);
  }
  public addIndustry(name) {
    return this.http.post(this.apiUrl + `crm/settings/industry`, { name: name }).pipe(
      tap(data => {
        this.toastrService.success("The new industry has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public addJobType(name) {
    return this.http.post(this.apiUrl + `crm/settings/jobType`, { name: name }).pipe(
      tap(data => {
        this.toastrService.success("The new job type has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public addServiceType(name) {
    return this.http.post(this.apiUrl + `crm/settings/serviceType`, { name: name }).pipe(
      tap(data => {
        this.toastrService.success("The new service type has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public addJobTitle(name) {
    return this.http.post(this.apiUrl + `crm/settings/jobTitle`, { name: name }).pipe(
      tap(data => {
        this.toastrService.success("The new job title has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public editIndustry(industry_id, name) {
    return this.http.put(this.apiUrl + `crm/settings/industry/${industry_id}`, { name: name }).pipe(
      tap(data => {
        this.toastrService.success("The industry has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public editJobType(type_id, name) {
    return this.http.put(this.apiUrl + `crm/settings/jobType/${type_id}`, { name: name }).pipe(
      tap(data => {
        this.toastrService.success("The job type has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public editServiceType(industry_id, name) {
    return this.http.put(this.apiUrl + `crm/settings/serviceType/${industry_id}`, { name: name }).pipe(
      tap(data => {
        this.toastrService.success("The service type has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public editJobTitle(title_id, name) {
    return this.http.put(this.apiUrl + `crm/settings/jobTitle/${title_id}`, { name: name }).pipe(
      tap(data => {
        this.toastrService.success("The job title has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  public removeIndustry(industry_id) {
    return this.http.delete(this.apiUrl + `crm/settings/industry/${industry_id}`).pipe(
      tap(data => {
        this.toastrService.success("The industry has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public removeJobType(type_id) {
    return this.http.delete(this.apiUrl + `crm/settings/jobType/${type_id}`).pipe(
      tap(data => {
        this.toastrService.success("The job type has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public removeServiceType(serviceType) {
    return this.http.delete(this.apiUrl + `crm/settings/serviceType/${serviceType}`).pipe(
      tap(data => {
        this.toastrService.success("The service type has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public removeJobTitle(title_id) {
    return this.http.delete(this.apiUrl + `crm/settings/jobTitle/${title_id}`).pipe(
      tap(data => {
        this.toastrService.success("The job title has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
}
