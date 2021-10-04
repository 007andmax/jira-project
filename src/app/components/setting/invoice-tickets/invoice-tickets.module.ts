import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceTicketsComponent } from './invoice-tickets.component';
import { TicketSettingsComponent } from './ticket-settings/ticket-settings.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceSettingsComponent } from './invoice-settings/invoice-settings.component';
import { QuotesSettingsComponent } from './quotes-settings/quotes-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InvoiceTicketsRoutingModule } from './invoice-tickets-routing.module';
import { Onlynumber } from 'src/app/helpers/Onlynumber';


@NgModule({
    declarations: [InvoiceTicketsComponent,
        TicketSettingsComponent,
        InvoiceSettingsComponent,
        QuotesSettingsComponent,
        Onlynumber
    ],
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        InvoiceTicketsRoutingModule
    ],



})
export class InvoiceTicketsModule { }
