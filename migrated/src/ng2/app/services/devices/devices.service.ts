import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getCompanyDevices(companyId){
    return this.http.get(this.apiUrl + `devices?companyId=${companyId}`);
  }


}
