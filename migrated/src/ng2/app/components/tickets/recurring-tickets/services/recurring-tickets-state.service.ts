import { Injectable, EventEmitter } from '@angular/core';
import { CreateRecurringTickets } from '../recurring-tickets-edit-aside/class/create-recurring-tickets';
import { RecurringTicket } from '../class/recurring-ticket';
import { Ticket } from '../../class/ticket';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { RecurringTicketUser } from '../interfaces/recurring-ticket-user';

@Injectable({
  providedIn: 'root'
})
export class RecurringTicketsStateService {
  crate: CreateRecurringTickets = new CreateRecurringTickets();
  public client: any;
  public tecketForCreate: Ticket = new Ticket();
  public onEditMode: EventEmitter<any> = new EventEmitter();
 
  constructor(  private companiesService: CompaniesService) { }

  public onInitClientList() {
    this.companiesService.getCompaniesList();
  }
  public setClient(client) {
    this.client = client.item;
    this.tecketForCreate.client = client;
  }

  public getClient() {
    return this.client;
  }
  public getCreateTicket() {
    return this.crate;
  }
  public onInitEditTicket(item: RecurringTicket) {
    this.onEditMode.emit(item);
  }
  public getEditMode() {
    return this.onEditMode;
  }
  public clearCreateTicket () {
    this.crate = new CreateRecurringTickets();
  }
  public getTypeCron(cron: string) {
    if (cron.match(/\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
      return "Daily";
    }  else if (cron.match(/\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)* \*/)) {
      return "Weekly";
    } 
    return "Monthly";
  }
 
}
