import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { Subject } from 'rxjs';
import { ConstantsStateService } from '../../states/constants/constants-state.service';

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
    private http: HttpClient,
    private constantsStateService:ConstantsStateService
  ) { }

  /**
   * Get devices from company
   * @param companyId - id of company
   */
  public getCompanyDevices(companyId){

    return this.http.get(this.apiUrl + `devices?companyId=${companyId}`);
    
  }
public createRemoteSession(deviceId, companyId, connectionType, ticketId) {
  return this.http.get(this.apiUrl + '/remote/createRemoteSession?deviceId=' + deviceId + '&connectionType=' + connectionType + '&companyId=' + companyId + (ticketId ? '&ticketId=' + ticketId : ''));
}
  

 
public getSessionId(remoteSessionId, connectionType) {

  if (!remoteSessionId) {
    throw 'remoteSessionId is required!';
  }

  if (!connectionType) {
    throw 'connectionType is required!';
  }
  return this.http.get(this.apiUrl + '/devices/getSessionId?remoteSessionId=' + remoteSessionId + '&connectionType=' + connectionType);

   
}
}
