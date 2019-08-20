import {EventEmitter, Injectable} from '@angular/core';
import { Ticket } from './class/ticket';
import { CompaniesService } from '../../services/company/companies.service';
import { RecurringTicket } from './recurring-tickets/class/recurring-ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketStateService {
  
  public showTicketRecurringAside: EventEmitter<any> = new EventEmitter();

  constructor(
  
  ) { }

 

  public toggleTicketRecurringAside() {
    this.showTicketRecurringAside.emit();
  }

 
}
