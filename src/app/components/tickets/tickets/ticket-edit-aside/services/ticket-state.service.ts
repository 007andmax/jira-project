import { Injectable, EventEmitter } from '@angular/core';
import { ServiceAgreementsService } from 'src/app/services/service-agreements/service-agreements.service';
import { RecurringService } from 'src/app/services/recurring/recurring.service';
import { TicketProfileUpdate } from '../../class/ticket-profile-update';
import { TicketProfileService } from '../../class/ticket-profile-service';
import { TicketProfileProduct } from '../../class/ticket-profile-product';
import { TicketsRealTimeService } from 'src/app/states/tickets/tickets-real-time.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class TicketStateService {
  servicesList: EventEmitter<any> = new EventEmitter();
  onSetTabUpdate: EventEmitter<any> = new EventEmitter();
  onEditUpdate: EventEmitter<any> = new EventEmitter();
  onChangeAssignedUser: EventEmitter<any> = new EventEmitter();
  changeUpdatesTicket: EventEmitter<any> = new EventEmitter();
  closedTicket: EventEmitter<any> = new EventEmitter();
  updateForRemove: TicketProfileUpdate = null;
  serviceForRemove: TicketProfileService = null;
  productForRemove: TicketProfileProduct = null;
  areTicketsPresented: boolean = false;
  areTicketsTerminated: boolean = false;
  servicesForTicket = [];
  constructor(private serviceAgreementsService: ServiceAgreementsService,
    private recurringService: RecurringService, private ticketsRealTimeService: TicketsRealTimeService, private websocketService: WebsocketService) {
    this.ticketsRealTimeService.changeTicket.subscribe(newChange => {
      this.changeUpdatesTicket.emit(newChange);
    });
  }
  public setEditUpdate(data) {
    this.onEditUpdate.emit(data);
  }
  public setAssignUser(data) {
    this.onChangeAssignedUser.emit(data);
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
