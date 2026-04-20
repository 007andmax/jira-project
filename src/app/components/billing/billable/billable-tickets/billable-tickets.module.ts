import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillableTicketsComponent } from './billable-tickets.component';
import { BillableAsideComponent } from '../billable-aside/billable-aside.component';
import { FormsModule } from '@angular/forms';
import { InvoiceFormComponent } from '../billable-aside/invoice-form/invoice-form.component';
import { InvoicePreviewComponent } from '../billable-aside/invoice-preview/invoice-preview.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { InvoiceFormEditCustomerModule } from '../billable-aside/invoice-form/invoice-form-edit-customer/invoice-form-edit-customer.module';

import { InvoiceFormTicketInfoComponent } from '../billable-aside/invoice-form/invoice-form-ticket-info/invoice-form-ticket-info.component';
import { InvoiceFormTicketEditComponent } from '../billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit.component';
import { InvoiceDiscountComponent } from '../billable-aside/invoice-form/invoice-discount/invoice-discount.component';

import { InvoiceFormTicketEditServiceComponent } from '../billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-service/invoice-form-ticket-edit-service.component';
import { InvoiceFormTicketEditProductComponent } from '../billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-product/invoice-form-ticket-edit-product.component';





import { BillableTicketsRoutingModule } from './billable-tickets-routing.module';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';


import { InvoiceChangeAddressComponent } from '../billable-aside/invoice-form/invoice-change-address/invoice-change-address.component';
import { InvoiceChangeAddressModule } from '../billable-aside/invoice-form/invoice-change-address/invoice-change-address.module';



@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    InvoiceFormEditCustomerModule,
    BillableTicketsRoutingModule,
    PreviewPhoneMaskModule,
    InvoiceChangeAddressModule,
    BillableTicketsComponent,
    BillableAsideComponent,
    InvoiceFormComponent,
    InvoicePreviewComponent,
    InvoiceFormTicketInfoComponent,
    InvoiceFormTicketEditComponent,
    InvoiceDiscountComponent,
    InvoiceFormTicketEditServiceComponent,
    InvoiceFormTicketEditProductComponent
],
})
export class BillableTicketsModule { }
