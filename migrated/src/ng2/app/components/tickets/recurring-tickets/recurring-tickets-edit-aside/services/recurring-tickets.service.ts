import { Injectable, ElementRef } from '@angular/core';
import { CreateRecurringTickets } from '../class/create-recurring-tickets';

@Injectable()
export class RecurringTicketsService {

  constructor( private elRef: ElementRef,) { }

  public setRulesCreateTicket(data:CreateRecurringTickets) {
   
    data.setRequireUpdate(this.elRef.nativeElement.querySelector('#requireUpdate').checked);
    data.setQuickClose(this.elRef.nativeElement.querySelector('#quickClose').checked);
    data.setCreateTask(this.elRef.nativeElement.querySelector('#createTask').checked);

  }
  public clearData() {
    this.elRef.nativeElement.querySelector('#service-description').value = '';
  }
}
