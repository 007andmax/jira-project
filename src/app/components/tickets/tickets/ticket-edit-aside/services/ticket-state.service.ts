import { Injectable, EventEmitter } from '@angular/core';
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
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { TicketProfileFormUpdate } from '../class/ticket-profile-form-update';
import { Task } from 'src/app/components/tasks/class/task';
import { TicketPreview } from 'src/app/components/billing/ticket-preview-report/class/ticket-preview';
import { TicketPreviewProduct } from 'src/app/components/billing/ticket-preview-report/class/ticket-preview-product';
import { TicketPreviewService } from 'src/app/components/billing/ticket-preview-report/class/ticket-preview-service';

@Injectable({
  providedIn: 'root'
})
export class TicketStateService {
  servicesList: EventEmitter<any> = new EventEmitter();
  onCloseTicketForReview: EventEmitter<any> = new EventEmitter();
  onSetTabUpdate: EventEmitter<any> = new EventEmitter();
  onSetNoteType: EventEmitter<any> = new EventEmitter();
  onOpenModalNote: EventEmitter<any> = new EventEmitter();
  onCloseModalNote: EventEmitter<any> = new EventEmitter();
  onEditUpdate: EventEmitter<any> = new EventEmitter();
  onRemoveUpdate: EventEmitter<any> = new EventEmitter();
  onEditUpdateByForm: EventEmitter<any> = new EventEmitter();
  changeUpdatesTicket: EventEmitter<any> = new EventEmitter();
  closedTicket: EventEmitter<any> = new EventEmitter();
  onDocumentForPreview: EventEmitter<any> = new EventEmitter();
  onServicePreloader: EventEmitter<any> = new EventEmitter();
  updateForRemove: TicketProfileUpdate = null;
  ticketPreviewForRemove: TicketPreview = null;
  serviceForRemove: TicketProfileService = null;
  productForRemove: TicketProfileProduct = null;
  productTicketPreviewForRemove: TicketPreviewProduct = null;
  serviceTicketPreviewForRemove: TicketPreviewService = null;
  areTicketsPresented: boolean = false;
  areTicketsTerminated: boolean = false;
  servicePreloader: boolean = false;
  servicesForTicket = [];
  ticketRoutingId: string;
  taskForRemove: Task;
  attachmentForRemove: TicketProfileAttachment;
  updateForEdit: TicketProfileUpdate;
  listTasks: Array<Task> = [];
  documents: Array<Document> = [];
  passwords: Array<PasswordRecord> = [];
  documentForPreview: Document;
  onGetDocuments: EventEmitter<any> = new EventEmitter();
  onGetPasswords: EventEmitter<any> = new EventEmitter();
  onGetDevices: EventEmitter<any> = new EventEmitter();
  onCloseTicket: EventEmitter<any> = new EventEmitter();
  onOpenTicket: EventEmitter<any> = new EventEmitter();
  ticketProfileFormUpdate: TicketProfileFormUpdate;
  devices: Array<DeviceCompany> = [];
  noteType: string = "PUBLIC";
  sub: Subscription = new Subscription();
  constructor(private contractsService: ContractsService,
    private recurringService: RecurringService,
    private ticketsRealTimeService: TicketsRealTimeService,
    private ticketsService: TicketsService,
    private devicesService: DevicesService,
    private devicesStateService: DevicesStateService,
    private websocketService: WebsocketService,
    private permissionsService: PermissionsService,
    public customerPortalStateService: CustomerPortalStateService,) {
    this.ticketsRealTimeService.changeTicket.subscribe(newChange => {
      this.changeUpdatesTicket.emit(newChange);
    });
  }
  public setServiceTicketPreviewForRemove(data) {
    this.serviceTicketPreviewForRemove = data;
  }
  public setTicketPreviewForRemove(data) {
    this.ticketPreviewForRemove = data;
  }
  public setProductTicketPreviewForRemove(data) {
    this.productTicketPreviewForRemove = data;
  }
  public openModalNote() {
    this.onOpenModalNote.emit(null);
  }
  public resetTicketProfileFormUpdate() {
    this.ticketProfileFormUpdate = null;
  }
  public getTicketProfileFormUpdate() {
    return this.ticketProfileFormUpdate;
  }
  public closeModalNote(data) {
    this.ticketProfileFormUpdate = data;
    this.onCloseModalNote.emit(data);
  }
  public setNoteType(data) {
    this.noteType = data;
    this.onSetNoteType.emit(data);
  }

  public getNoteType() {
    return this.noteType;
  }
  public fastCloseTicket() {
    this.onCloseTicket.emit(null);
  }
  public fastOpenTicket() {
    this.onOpenTicket.emit(null);
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
      if (data && Object.keys(data).length > 0) {
        this.devices = data[companyID].map(item => new DeviceCompany(item, companyID));
        this.devices.sort((a, b) => (a.getLabelForEdit().toLowerCase() > b.getLabelForEdit().toLowerCase()) ?
          1 : ((b.getLabelForEdit().toLowerCase() > a.getLabelForEdit().toLowerCase()) ? -1 : 0));
        this.onGetDevices.emit(this.devices);
      }
    });
    let onDeviceUninstalled = this.devicesStateService.onChangeDevice.subscribe(newChange => {
      if (companyID == newChange.data.clientCompanyId) {
        this.devicesStateService.changeDevice(this.devices, newChange);
        this.onGetDevices.emit(this.devices);
      }
    })
    this.sub.add(onDeviceUninstalled);
    /*  let onInitWebSocket = this.devicesStateService.onInitWebSocket.subscribe(data => {
        if (this.devices.filter(item => !item.isCustom).length > 0 && this.devicesStateService.getIsInitWebSocket()) this.sendDeviceStatusRequest(companyID, this.devices.filter(item => item.agentId).map(item => item.agentId));
      })
      this.sub.add(onInitWebSocket);*/
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
      let findIndex = this.devices.findIndex(item => item.deviceId === data.id);
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
  public removeUpdate(data) {
    this.onRemoveUpdate.emit(data);
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
  public getServicesList(company_id) {
    this.servicePreloader = true;
    this.onServicePreloader.emit(this.servicePreloader);
    this.recurringService.getServiceList(company_id).subscribe((res: any) => {
      this.servicesForTicket = res.filter(item => item.canUseInTicket);
      this.servicesForTicket.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.servicesList.emit(this.servicesForTicket);
      this.servicePreloader = false;
      this.onServicePreloader.emit(this.servicePreloader);
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
  public setDevices(data) {
    this.devices = data;
  }
  public getOnGetServicesList() {
    return this.servicesList;
  }
}
