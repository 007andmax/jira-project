import { Injectable } from '@angular/core';

import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GadgetsService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getCompanyDevices(){
    return this.http.get(this.apiUrl + `gadgets`);
  }

  addNewGadget(clientCompanyId, name) {
    return this.http.post(this.apiUrl + `gadgets`, {
      clientCompanyId: clientCompanyId,
      name: name
    })
  }

  deleteGadget(id) {
    return this.http.delete(this.apiUrl + `gadgets/${id}`)
  }

}
