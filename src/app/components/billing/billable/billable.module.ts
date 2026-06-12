import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillableComponent } from './billable.component';
import { BillableItemComponent } from './billable-item/billable-item.component';
import { BillableRoutingModule } from './billable-routing.module';


import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceChangeAddressComponent } from './billable-aside/invoice-form/invoice-change-address/invoice-change-address.component';
import { TicketsTableItemRequestedByModule } from '../../tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';


import { UsersTableCompanyByModule } from '../../users/users-table/users-table-company-by/users-table-company-by.module';


@NgModule({
    imports: [
    CommonModule,
    BillableRoutingModule,
    DisabledBtnModule,
    PreloaderTicketModule,
    FormsModule,
    NgbModule,
    TicketsTableItemRequestedByModule,
    UsersTableCompanyByModule
],



})
export class BillableModule { }
