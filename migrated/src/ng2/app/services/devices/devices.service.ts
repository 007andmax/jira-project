import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";

/**
 * Device service to work with api
 */
@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  private apiUrl = environment.apiUrl;

  /**
   * Device api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient
  ) { }

  /**
   * Get devices from company
   * @param companyId - id of company
   */
  public getCompanyDevices(companyId){
    return this.http.get(this.apiUrl + `devices?companyId=${companyId}`);
  }

}
