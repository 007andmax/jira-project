import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { Subject } from 'rxjs';
import { ConstantsStateService } from '../../states/constants/constants-state.service';

import { Ticket } from '../../components/tickets/class/ticket';
import { map } from 'rxjs/operators';
import { Device } from '../../components/company-devices/class/device';

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
    private constantsStateService: ConstantsStateService
  ) { }

  /**
   * Get devices from company
   * @param companyId - id of company
   */
  public getCompanyDevices(companyId) {
    return this.http.get(this.apiUrl + `devices?companyId=${companyId}`);
  }
  public getDeviceExtended(companyId, agentId) {
    return this.http.get(this.apiUrl + `devices/extended?companyId=${companyId}&agentId=${agentId}`);
  }
  public setIcon(data) {
    return this.http.post(this.apiUrl + '/devices/editAgentInfo', data);
  }
  public sendPowerAction(companyId, agentIds, action) {

    if (!Array.isArray(agentIds)) {
      agentIds = [agentIds];
    }
    return this.http.post(this.apiUrl + 'devices/sendPowerAction?companyId=' + companyId + '&action=' + action, agentIds);

  }
  sendDeviceStatusRequest(companyId, agentIds, actions) {
    return this.http.post(this.apiUrl + '/devices/agentStatuses', {
      companyId: companyId,
      agentIds: agentIds,
      actions: actions
    });
  }
  sendUninstallAgentRequest(companyId, devicesIds) {

    if (!Array.isArray(devicesIds)) {
      devicesIds = [devicesIds];
    }
    return this.http.post(this.apiUrl + '/devices/sendUninstallAgentRequest?companyId=' + companyId, devicesIds);
  }
  public createRemoteSession(deviceId, companyId, connectionType, ticketId) {
    return this.http.get(this.apiUrl + '/remote/createRemoteSession?deviceId=' + deviceId + '&connectionType=' + connectionType + '&companyId=' + companyId + (ticketId ? '&ticketId=' + ticketId : ''));
  }
  markDeviceAsMaster(companyId, agentId) {
    var request = {
      "masterAgentId": agentId,
      "clientCompanyId": companyId
    }
    return this.http.post(this.apiUrl + '/devices/updateMasterAgent', request);

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
