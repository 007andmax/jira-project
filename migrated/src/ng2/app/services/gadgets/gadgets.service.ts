import { Injectable } from '@angular/core';

import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

/**
 * Gadgets service to work with api
 */
@Injectable({
  providedIn: 'root'
})
export class GadgetsService {

  private apiUrl = environment.apiUrl;

  /**
   * Gadgets api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient
  ) { }

  /**
   * Get devices from company
   */
  public getCompanyDevices(){
    return this.http.get(this.apiUrl + `gadgets`);
  }

  /**
   * Add new gadget
   * @param clientCompanyId - id of client company
   * @param name - name of new gadget
   */
  public addNewGadget(clientCompanyId, name) {
    return this.http.post(this.apiUrl + `gadgets`, {
      clientCompanyId: clientCompanyId,
      name: name
    })
  }

  /**
   * Delete gadget
   * @param id - id of gadget
   */
  public deleteGadget(id) {
    return this.http.delete(this.apiUrl + `gadgets/${id}`)
  }

}
