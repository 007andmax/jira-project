import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketSettingsPageComponent } from './ticket-settings-page.component';
import { TicketSettingsPageRoutingModule } from './ticket-settings-page-routing.module';
import { TicketSettingsComponent } from './ticket-settings/ticket-settings.component';
import { TicketsStatusComponent } from './tickets-status/tickets-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { Onlynumber } from 'src/app/helpers/Onlynumber';
import { CannedResponsesComponent } from './canned-responses/canned-responses.component';


import { TicketsPriorityComponent } from './tickets-priority/tickets-priority.component';



@NgModule({
    imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TicketSettingsPageRoutingModule,
    TicketSettingsPageComponent,
    TicketSettingsComponent,
    TicketsStatusComponent,
    Onlynumber,
    CannedResponsesComponent,
    TicketsPriorityComponent
],
})
export class TicketSettingsPageModule { }
