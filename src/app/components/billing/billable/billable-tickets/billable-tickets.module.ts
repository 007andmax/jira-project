import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillableTicketsComponent } from './billable-tickets.component';
import { BillableAsideComponent } from '../billable-aside/billable-aside.component';
import { FormsModule } from '@angular/forms';
import { InvoiceFormComponent } from '../billable-aside/invoice-form/invoice-form.component';
import { InvoicePreviewComponent } from '../billable-aside/invoice-preview/invoice-preview.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { InvoiceFormEditCustomerModule } from '../billable-aside/invoice-form/invoice-form-edit-customer/invoice-form-edit-customer.module';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { InvoiceFormTicketInfoComponent } from '../billable-aside/invoice-form/invoice-form-ticket-info/invoice-form-ticket-info.component';
import { InvoiceFormTicketEditComponent } from '../billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit.component';
import { InvoiceDiscountComponent } from '../billable-aside/invoice-form/invoice-discount/invoice-discount.component';
import { InvoiceRegularNoteModule } from '../billable-aside/invoice-form/invoice-regular-note/invoice-regular-note.module';
import { InvoiceFormTicketEditServiceComponent } from '../billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-service/invoice-form-ticket-edit-service.component';
import { InvoiceFormTicketEditProductComponent } from '../billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-product/invoice-form-ticket-edit-product.component';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TicketProfileUpdatesServiceTimepickerModule } from 'src/app/components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-timepicker/ticket-profile-updates-service-timepicker.module';
import { TicketProfileUpdatesServiceDurationModule } from 'src/app/components/tickets/tickets/ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service-duration/ticket-profile-updates-service-duration.module';
import { InvoiceFormTicketEditTaxesModule } from '../billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { BillableTicketsRoutingModule } from './billable-tickets-routing.module';


@NgModule({
    declarations: [BillableTicketsComponent,
        BillableAsideComponent,
        InvoiceFormComponent,
        InvoicePreviewComponent,
        InvoiceFormTicketInfoComponent,
        InvoiceFormTicketEditComponent,
        InvoiceDiscountComponent,
        InvoiceFormTicketEditServiceComponent,
        InvoiceFormTicketEditProductComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        InvoiceFormEditCustomerModule,
        MatSelectModule,
        MatChipsModule,
        DatePickerModule,
        InvoiceRegularNoteModule,
        TextAreaModule,
        NumberModule,
        TicketProfileUpdatesServiceTimepickerModule,
        TicketProfileUpdatesServiceDurationModule,
        InvoiceFormTicketEditTaxesModule,
        BillableTicketsRoutingModule

    ],



})
export class BillableTicketsModule { }
