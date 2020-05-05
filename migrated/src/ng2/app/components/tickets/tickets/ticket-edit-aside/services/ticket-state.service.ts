import { Injectable, EventEmitter } from '@angular/core';
import { ServiceAgreementsService } from 'src/ng2/app/services/service-agreements/service-agreements.service';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';
import { TicketProfileUpdate } from '../../class/ticket-profile-update';

@Injectable({
  providedIn: 'root'
})
export class TicketStateService {
  servicesList: EventEmitter<any> = new EventEmitter();
  updateForRemove:TicketProfileUpdate = null;
  areTicketsPresented: boolean = false;
  areTicketsTerminated: boolean = false;
  servicesForTicket = [];
  constructor(private serviceAgreementsService: ServiceAgreementsService,
    private recurringService: RecurringService,) { }

  public getServicesList(ticketProfile) {
  
      this.recurringService.getServiceList(ticketProfile.company.id).subscribe((res: any) => {
        this.servicesForTicket = res;
        this.getServiceAgreements(ticketProfile);
      })
  
   
  }
  private getServiceAgreements(ticketProfile) {
    this.serviceAgreementsService.getServiceAgreements().subscribe((data: any) => {
      let listAgreements = data;
      let Agreements = data.filter((el) => el.company.id === ticketProfile.company.id)
      this.areTicketsPresented = (Agreements.length > 0) ? true : false;
      // if (this.areTicketsPresented)
      this.servicesForTicket.filter(item => item.canUseInTicket);
      console.log("Agreements", Agreements);
      this.areTicketsTerminated = Agreements.every((el) => {
        return el.status === 'EXPIRED' || el.status === 'TERMINATED'
      })
    })
    this.servicesList.emit(this.servicesForTicket);
  }
  public setUpdateForRemove(data) {
    this.updateForRemove = data;
  }
  public getUpdateForRemove() {
    return this.updateForRemove;
  }
  public getServicesForTicket() {
    return this.servicesForTicket;
  }
  public isTicketsPresented () {
    return this.areTicketsPresented;
  }
  public isTicketsTerminated () {
    return this.areTicketsTerminated;
  }
  public getOnGetServicesList() {
    return this.servicesList;
  }
}
