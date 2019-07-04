import {EventEmitter, Injectable} from '@angular/core';
import { Ticket } from './class/ticket';
import { CompaniesService } from '../../services/company/companies.service';

@Injectable({
  providedIn: 'root'
})
export class TicketStateService {
  public client: any;
  public tecketForCreate: Ticket = new Ticket();
  public showTicketRecurringAside: EventEmitter<any> = new EventEmitter();

  constructor(
    private companiesService: CompaniesService
  ) { }

  public onInitClientList () {
this.companiesService.getCompaniesList();
  }
  public setClient(client) {
    this.client = client;
    this.tecketForCreate.client = client;
  }

  public toggleTicketRecurringAside() {
    this.showTicketRecurringAside.emit();
  }
  
}
