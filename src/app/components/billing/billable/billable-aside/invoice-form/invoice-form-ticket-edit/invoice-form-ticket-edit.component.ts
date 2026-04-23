import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InvoiceProfileTicket } from '../../../class/invoice-profile-ticket';
import * as moment from "moment";
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { InvoiceFormTicketEditProductComponent } from './invoice-form-ticket-edit-product/invoice-form-ticket-edit-product.component';
import { InvoiceFormTicketEditServiceComponent } from './invoice-form-ticket-edit-service/invoice-form-ticket-edit-service.component';

@Component({
  standalone: true,
  imports: [InvoiceFormTicketEditProductComponent, InvoiceFormTicketEditServiceComponent, FormsModule, CommonModule],
  selector: 'app-invoice-form-ticket-edit',
  templateUrl: './invoice-form-ticket-edit.component.html',
  styleUrls: ['./invoice-form-ticket-edit.component.scss'],

})
export class InvoiceFormTicketEditComponent implements OnInit {
  @Input() ticket: InvoiceProfileTicket;
  @Output() onUpdateSubject = new EventEmitter();

  currentCompany;
  constructor(private companiesStateService: CompaniesStateService,
    private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.ticket.setNewSubject(JSON.parse(JSON.stringify(this.ticket.subject)));
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  onChangeSubject() {
    this.ticket.setChangeSubject(this.ticket.newSubject !== this.ticket.subject);
  }
  getDuration(input) {
    let timeInMinutes = input * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes) + ' hr(s)';
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public trackById(index, item) {
    return item.id;
  }
}
