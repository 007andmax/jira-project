import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { Subject } from 'rxjs';
import { ConstantsStateService } from '../../states/constants/constants-state.service';

import { Ticket } from '../../components/tickets/class/ticket';
import { map, tap } from 'rxjs/operators';
import { Device } from '../../components/company-devices/class/device';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';

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
    private constantsStateService: ConstantsStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService
  ) { }

  /**
   * Get devices from company
   * @param companyId - id of company
   */
  public getManufactures() {
    return this.http.get(this.apiUrl + `devices/manufactures`);
  }
  public getModels(id) {
    return this.http.get(this.apiUrl + `devices/manufactures/models?manufacturerId=${id}`);
  }
  public runScanDevices(companyId) {
    return this.http.get(this.apiUrl + `devices/refreshNetworkScan?companyId=${companyId}`);
  }
  public getCountByCompany(ids) {
    return this.http.post(this.apiUrl + `devices/count`, { companies: ids });
  }
  public addCustomDevice(data) {
    return this.http.post(this.apiUrl + `devices`, data);
  }
  public remoteInstall(data) {
    return this.http.post(this.apiUrl + `devices/remoteInstall`, data);
  }
  public sendDescription(companyId, networkDeviceId, description) {
    return this.http.post(this.apiUrl + `/devices/sendDescription?companyId=${companyId}&networkDeviceId=${networkDeviceId}`, description);
  }
  public getLastScanDevices(companyId) {
    return this.http.get(this.apiUrl + `devices/networkScan?companyId=${companyId}`);
  }
  public getCompanyDevices(companyId) {
    return this.http.get(this.apiUrl + `devices?companyId=${companyId}`);
  }
  public getDeviceExtended(companyId, agentId) {
    return this.http.get(this.apiUrl + `devices/extended?companyId=${companyId}&agentId=${agentId}`);
  }
  public getSoft(companyId) {
    return this.http.get(this.apiUrl + `devices/extended?companyId=${companyId}`);
  }
  public editAgentInfo(data) {
    return this.http.post(this.apiUrl + '/devices/editAgentInfo', data);
  }
  public sendPowerAction(companyId, agentIds, action) {
    if (!Array.isArray(agentIds)) {
      agentIds = [agentIds];
    }
    return this.http.post(this.apiUrl + 'devices/sendPowerAction?companyId=' + companyId + '&action=' + action, agentIds);
  }
  public getSomeInfoForDevices(companyId) {
    return this.http.get(this.apiUrl + `devices/getSomeInfoForDevices?companyId=${companyId}`);
  }

  sendDeviceStatusRequest(companyId, agentIds, actions) {
    return this.http.post(this.apiUrl + '/devices/agentStatuses', {
      companyId: companyId,
      agentIds: agentIds,
      actions: actions
    });
  }
  public deleteCustomDevice(deviceId) {
    return this.http.delete(this.apiUrl + `/devices/${deviceId}`).pipe(
      tap(data => {
        this.toastrService.success("The custom device has been successfully deleted");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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
