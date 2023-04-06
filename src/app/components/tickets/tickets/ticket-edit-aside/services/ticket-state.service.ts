import { Injectable, EventEmitter } from '@angular/core';
import { ServiceAgreementsService } from 'src/app/services/service-agreements/service-agreements.service';
import { RecurringService } from 'src/app/services/recurring/recurring.service';
import { TicketProfileUpdate } from '../../class/ticket-profile-update';
import { TicketProfileService } from '../../class/ticket-profile-service';
import { TicketProfileProduct } from '../../class/ticket-profile-product';
import { TicketsRealTimeService } from 'src/app/states/tickets/tickets-real-time.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { TicketProfileTask } from '../../class/ticket-profile-task';
import { TicketProfileAttachment } from '../../class/ticket-profile-attachment';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { Document } from 'src/app/components/documents/class/document';
import { PasswordRecord } from 'src/app/components/password-manager/class/password-record';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketStateService {
  servicesList: EventEmitter<any> = new EventEmitter();
  onSetTabUpdate: EventEmitter<any> = new EventEmitter();
  onEditUpdate: EventEmitter<any> = new EventEmitter();
  onEditUpdateByForm: EventEmitter<any> = new EventEmitter();
  changeUpdatesTicket: EventEmitter<any> = new EventEmitter();
  closedTicket: EventEmitter<any> = new EventEmitter();
  onDocumentForPreview: EventEmitter<any> = new EventEmitter();
  updateForRemove: TicketProfileUpdate = null;
  serviceForRemove: TicketProfileService = null;
  productForRemove: TicketProfileProduct = null;
  areTicketsPresented: boolean = false;
  areTicketsTerminated: boolean = false;
  servicesForTicket = [];
  ticketRoutingId: string;
  taskForRemove: TicketProfileTask;
  attachmentForRemove: TicketProfileAttachment;
  updateForEdit: TicketProfileUpdate;
  listTasks: Array<TicketProfileTask> = [];
  documents: Array<Document> = [];
  passwords: Array<PasswordRecord> = [];
  documentForPreview: Document;
  onGetDocuments: EventEmitter<any> = new EventEmitter();
  onGetPasswords: EventEmitter<any> = new EventEmitter();
  onGetDevices: EventEmitter<any> = new EventEmitter();
  devices: Array<DeviceCompany> = [];
  sub: Subscription = new Subscription();
  constructor(private serviceAgreementsService: ServiceAgreementsService,
    private recurringService: RecurringService,
    private ticketsRealTimeService: TicketsRealTimeService,
    private ticketsService: TicketsService,
    private devicesService: DevicesService,
    private devicesStateService: DevicesStateService,
    private websocketService: WebsocketService) {
    this.ticketsRealTimeService.changeTicket.subscribe(newChange => {
      this.changeUpdatesTicket.emit(newChange);
    });
  }
  public setDocumentForPreview(data) {
    this.documentForPreview = data;
    if (data) this.onDocumentForPreview.emit(data);
  }
  public getDevices() {
    return this.devices;
  }
  public getDocumentForPreview() {
    return this.documentForPreview;
  }
  public getDocuments() {
    return this.documents;
  }
  public getPasswords() {
    return this.passwords;
  }
  public getPasswordsDocuments(userId) {
    this.ticketsService.getPasswordsDocuments(userId).subscribe((data: any) => {
      this.documents = data.documentDtos.map(item => new Document(item));
      this.passwords = data.passwordRecordDtos.map(item => new PasswordRecord(item));
      this.onGetDocuments.emit(this.documents);
      this.onGetPasswords.emit(this.passwords);
    })
  }
  public getDevicesByCompany(companyID) {
    this.devicesService.getCompanyDevices(companyID).subscribe((data: any) => {
      if (data) {
        this.devices = data[companyID].map(item => new DeviceCompany(item, companyID));
        this.devices.sort((a, b) => (a.getLabelForEdit().toLowerCase() > b.getLabelForEdit().toLowerCase()) ?
          1 : ((b.getLabelForEdit().toLowerCase() > a.getLabelForEdit().toLowerCase()) ? -1 : 0));
        this.onGetDevices.emit(this.devices);
        if (this.devices.length > 0 && this.devicesStateService.getIsInitWebSocket()) this.sendDeviceStatusRequest(companyID, this.devices.filter(item => item.agentId).map(item => item.agentId));
      }
    });
    let onInitWebSocket = this.devicesStateService.onInitWebSocket.subscribe(data => {
      if (this.devices.length > 0 && this.devicesStateService.getIsInitWebSocket()) this.sendDeviceStatusRequest(companyID, this.devices.filter(item => item.agentId).map(item => item.agentId));
    })
    this.sub.add(onInitWebSocket);
    let getOnUpdateAgentActivityStatus = this.devicesStateService.getOnUpdateAgentActivityStatus().subscribe(newChange => {
      var isCurrentCompany = this.devices.find(item => item.agentId === newChange.data.agentId);
      if (newChange.data && newChange.data.statuses && newChange.data.statuses.hasOwnProperty('Idle')) {
        if (isCurrentCompany) {
          for (var i = 0; i < this.devices.length; i++) {
            if (this.devices[i].agentId === newChange.data.agentId) {
              if (newChange.data.statuses.Idle) {
                this.devices[i].timing.idle = this.devicesStateService.getMillisecondsFromTimeString(newChange.data.statuses.Idle);
              } else {
                this.devices[i].timing.idle = null;
              }
              break;
            }
          }
        }
      } else if (newChange.data && newChange.data.statuses && newChange.data.statuses.hasOwnProperty('NoRestart') && newChange.data.statuses.hasOwnProperty('Online')) {
        if (isCurrentCompany) {
          for (var i = 0; i < this.devices.length; i++) {
            if (this.devices[i].agentId === newChange.data.agentId) {
              this.devices[i].timing.noRestart = this.devicesStateService.getMillisecondsFromTimeString(newChange.data.statuses.NoRestart);
              this.devices[i].timing.online = this.devicesStateService.getMillisecondsFromTimeString(newChange.data.statuses.Online);
              this.devices[i].timing.uptimeForOrdering = this.devicesStateService.getMillisecondsFromTimeString(newChange.data.statuses.Online);
              break;
            }
          }
        }
      }
    })
    this.sub.add(getOnUpdateAgentActivityStatus);
    let getOnResetDeviceTiming = this.devicesStateService.getOnResetDeviceTiming().subscribe(data => {
      let findIndex = this.devices.findIndex(item => item.id === data.id);
      if (findIndex > -1) {
        this.devices[findIndex].timing.idle = null;
        if (data.online) {
          this.devices[findIndex].timing.online = 0;
        } else {
          this.devices[findIndex].timing.offline = 0;
          this.devices[findIndex].offlineAt = new Date().toUTCString();
          this.devices[findIndex].timing.uptimeForOrdering = 0;
        }
      }
    })
    this.sub.add(getOnResetDeviceTiming);
  }
  sendDeviceStatusRequest(companyId, ids) {
    this.devicesService.sendDeviceStatusRequest(companyId, ids, ["idle", "norestart", "online"]).subscribe(data => {
    })
  }
  public setListTasks(data) {
    this.listTasks = data;
  }
  public getListTasks() {
    return this.listTasks;
  }
  public editUpdateByFrom(data) {
    this.updateForEdit = data;
    this.onEditUpdateByForm.emit(data);
  }
  public getUpdateForEdit() {
    return this.updateForEdit;
  }
  public setAttachmentForRemove(data) {
    this.attachmentForRemove = data;
  }
  public getAttachmentForRemove() {
    return this.attachmentForRemove;
  }
  public setTaskForRemove(data) {
    this.taskForRemove = data;
  }
  public getTaskForRemove() {
    return this.taskForRemove;
  }
  public setTicketRoutingId(data) {
    this.ticketRoutingId = data;
  }
  public getTicketRoutingId() {
    return this.ticketRoutingId;
  }
  public setEditUpdate(data) {
    this.onEditUpdate.emit(data);
  }
  public setTabUpdate(data) {
    this.onSetTabUpdate.emit(data);
  }
  public onTicketClosed() {
    this.closedTicket.emit(null);
  }
  public getOnTicketClosed() {
    return this.closedTicket;
  }
  public getServicesList(ticketProfile) {
    this.recurringService.getServiceList(ticketProfile.company.id).subscribe((res: any) => {
      this.servicesForTicket = res;
      this.getServiceAgreements(ticketProfile);
    })
  }
  public subsribeToTicket(id) {
    this.websocketService.subsribeToTicket(id);
  }
  public subsribeToTicketTasks(id) {
    this.websocketService.subsribeToTicketTasks(id);
  }
  public unsubscribeTicket() {
    this.ticketsRealTimeService.unsubscribeTicket();
  }
  public getOnChangeUpdatesTicket() {
    return this.changeUpdatesTicket;
  }

  private getServiceAgreements(ticketProfile) {
    this.serviceAgreementsService.getServiceAgreements().subscribe((data: any) => {
      let Agreements = data.filter((el) => el.company.id === ticketProfile.company.id)
      this.areTicketsPresented = (Agreements.length > 0) ? true : false;
      this.servicesForTicket = this.servicesForTicket.filter(item => item.canUseInTicket);
      this.areTicketsTerminated = Agreements.every((el) => {
        return el.status === 'EXPIRED' || el.status === 'TERMINATED'
      })
    })
    this.servicesForTicket.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.servicesList.emit(this.servicesForTicket);
  }
  public setProductForRemove(data) {
    this.productForRemove = data;
  }
  public setServiceForRemove(data) {
    this.serviceForRemove = data;
  }
  public setUpdateForRemove(data) {
    this.updateForRemove = data;
  }
  public getProductForRemove() {
    return this.productForRemove;
  }
  public getServiceForRemove() {
    return this.serviceForRemove;
  }
  public getUpdateForRemove() {
    return this.updateForRemove;
  }
  public getServicesForTicket() {
    return this.servicesForTicket;
  }
  public isTicketsPresented() {
    return this.areTicketsPresented;
  }
  public isTicketsTerminated() {
    return this.areTicketsTerminated;
  }
  public getOnGetServicesList() {
    return this.servicesList;
  }
}
