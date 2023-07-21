import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketSettingsPageComponent } from './ticket-settings-page.component';
import { TicketSettingsPageRoutingModule } from './ticket-settings-page-routing.module';
import { TicketSettingsComponent } from './ticket-settings/ticket-settings.component';
import { TicketsStatusComponent } from './tickets-status/tickets-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { ClickOtsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { Onlynumber } from 'src/app/helpers/Onlynumber';
import { CannedResponsesComponent } from './canned-responses/canned-responses.component';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';


@NgModule({
    declarations: [
        TicketSettingsPageComponent,
        TicketSettingsComponent,
        TicketsStatusComponent,
        Onlynumber,
        CannedResponsesComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        DropDownModule,
        ClickOtsideModule,
        TicketSettingsPageRoutingModule,
        DynamicTooltipModule,
        KeyUpEnterModule
    ],
})
export class TicketSettingsPageModule { }
