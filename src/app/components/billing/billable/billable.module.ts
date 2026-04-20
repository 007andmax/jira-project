import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillableComponent } from './billable.component';
import { BillableItemComponent } from './billable-item/billable-item.component';
import { BillableRoutingModule } from './billable-routing.module';


import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceChangeAddressComponent } from './billable-aside/invoice-form/invoice-change-address/invoice-change-address.component';


@NgModule({
    imports: [
    CommonModule,
    BillableRoutingModule,
    FormsModule,
    NgbModule,
    BillableComponent,
    BillableItemComponent,
],
})
export class BillableModule { }
