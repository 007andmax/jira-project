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
  documentForPreview: Document;
  onGetDocuments: EventEmitter<any> = new EventEmitter();
  constructor(private serviceAgreementsService: ServiceAgreementsService,
    private recurringService: RecurringService,
    private ticketsRealTimeService: TicketsRealTimeService,
    private ticketsService: TicketsService,
    private websocketService: WebsocketService) {
    this.ticketsRealTimeService.changeTicket.subscribe(newChange => {
      this.changeUpdatesTicket.emit(newChange);
    });
  }
  public setDocumentForPreview(data) {
    this.documentForPreview = data;
    if (data) this.onDocumentForPreview.emit(data);
  }
  public getDocumentForPreview() {
    return this.documentForPreview;
  }
  public getDocuments() {
    return this.documents;
  }
  public getPasswordsDocuments(userId) {
    this.ticketsService.getPasswordsDocuments(userId).subscribe((data: any) => {
      this.documents = data.documentDtos.map(item => new Document(item));
      this.onGetDocuments.emit(this.documents);
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
