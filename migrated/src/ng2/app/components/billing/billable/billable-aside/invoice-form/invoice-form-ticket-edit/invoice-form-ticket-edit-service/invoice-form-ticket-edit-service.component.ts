import { Component, OnInit, Input } from '@angular/core';
import { BillableProfileTicketServiceExpense } from '../../../../class/billable-profile-ticket-service-expense';

@Component({
  selector: 'app-invoice-form-ticket-edit-service',
  templateUrl: './invoice-form-ticket-edit-service.component.html',
  styleUrls: ['./invoice-form-ticket-edit-service.component.scss']
})
export class InvoiceFormTicketEditServiceComponent implements OnInit {
  @Input() service:BillableProfileTicketServiceExpense
  constructor() { }

  ngOnInit() {
  }

}
