import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  ) { }
  public getIndustryList() {
    return this.http.get(this.apiUrl + `crm/settings/industry`);
  }
  public getServiceTypeList() {
    return this.http.get(this.apiUrl + `crm/settings/serviceType`);
  }
  public getJobTitleList() {
    return this.http.get(this.apiUrl + `crm/settings/jobTitle`);
  }
  public addIndustry(name) {
    return this.http.post(this.apiUrl + `crm/settings/industry`, { name: name });
  }
  public addServiceType(name) {
    return this.http.post(this.apiUrl + `crm/settings/serviceType`, { name: name });
  }
  public addJobTitle(name) {
    return this.http.post(this.apiUrl + `crm/settings/jobTitle`, { name: name });
  }
  public editIndustry(industry_id, name) {
    return this.http.put(this.apiUrl + `crm/settings/industry/${industry_id}`, { name: name });
  }
  public editServiceType(industry_id, name) {
    return this.http.put(this.apiUrl + `crm/settings/serviceType/${industry_id}`, { name: name });
  }
  public editJobTitle(title_id, name) {
    return this.http.put(this.apiUrl + `crm/settings/jobTitle/${title_id}`, { name: name });
  }
  public removeIndustry(industry_id) {
    return this.http.delete(this.apiUrl + `crm/settings/industry/${industry_id}`);
  }
  public removeServiceType(serviceType) {
    return this.http.delete(this.apiUrl + `crm/settings/serviceType/${serviceType}`);
  }
  public removeJobTitle(title_id) {
    return this.http.delete(this.apiUrl + `crm/settings/jobTitle/${title_id}`);
  }
}
