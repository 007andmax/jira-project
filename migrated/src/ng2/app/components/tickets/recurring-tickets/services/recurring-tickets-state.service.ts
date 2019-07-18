import { Injectable } from '@angular/core';
import { CreateRecurringTickets } from '../recurring-tickets-edit-aside/class/create-recurring-tickets';

@Injectable({
  providedIn: 'root'
})
export class RecurringTicketsStateService {
crate:CreateRecurringTickets = new CreateRecurringTickets();
  constructor() { }

  public getCreateTicket() {
    return this.crate;
  }
}
