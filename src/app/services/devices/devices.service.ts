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
  public validateManufacturesAndModelForRemove(manufacture_id, model_id = null) {
    return this.http.get(this.apiUrl + `devices/custom/filter?manufacturerId=${manufacture_id}${model_id ? `&modelId=${model_id}` : ''}`);
  }
  public addManufacture(data) {
    this.appStateService.setServerError(true);
    return this.http.post(this.apiUrl + `devices/manufactures`, data).pipe(
      tap(data => {
        this.appStateService.setServerError(false);
        this.toastrService.success("The new Manufacturer has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public editDevice(data) {
    this.appStateService.setServerError(true);
    return this.http.put(this.apiUrl + `devices/custom`, data).pipe(
      tap(data => {
        this.appStateService.setServerError(false);
        this.appStateService.setCustomeError(false);
        this.toastrService.success("The new custom device has been successfully edited");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public deleteManufactur(manufacture_id) {
    return this.http.delete(this.apiUrl + `devices/manufactures/${manufacture_id}`).pipe(
      tap(data => {
        this.appStateService.setCustomeError(false);
        this.toastrService.success("The Manufacturer has been successfully deleted");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public deleteModel(id) {
    return this.http.delete(this.apiUrl + `devices/manufactures/models/${id}`).pipe(
      tap(data => {
        this.appStateService.setCustomeError(false);
        this.toastrService.success("The Model has been successfully deleted");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public editManufactur(data) {
    this.appStateService.setServerError(true);
    return this.http.put(this.apiUrl + `devices/manufactures`, data).pipe(
      tap(data => {
        this.appStateService.setServerError(false);
        this.toastrService.success("The Manufacturer has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public editModel(data) {
    this.appStateService.setServerError(true);
    return this.http.put(this.apiUrl + `devices/manufactures/models`, data).pipe(
      tap(data => {
        this.appStateService.setServerError(false);
        this.toastrService.success("The Model has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public addModel(data) {
    this.appStateService.setServerError(true);
    return this.http.post(this.apiUrl + `devices/manufactures/models`, data).pipe(
      tap(data => {
        this.appStateService.setServerError(false);
        this.toastrService.success("The new Model has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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
    this.appStateService.setServerError(true);
    return this.http.post(this.apiUrl + `devices/custom`, data).pipe(
      tap(data => {
        this.appStateService.setServerError(false);
        this.appStateService.setCustomeError(false);
        this.toastrService.success("The new custom device has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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
    this.appStateService.setCustomeError(true, "The device list cannot be loaded, please try to refresh your page.");
    return this.http.get(this.apiUrl + `devices?companyId=${companyId}`).pipe(
      tap(data => {
        this.appStateService.setServerError(false);
        this.appStateService.setCustomeError(false);
        this.appStateService.changeDetectorRef();
        return data;
      }));
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
    return this.http.delete(this.apiUrl + `/devices/custom/${deviceId}`).pipe(
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
