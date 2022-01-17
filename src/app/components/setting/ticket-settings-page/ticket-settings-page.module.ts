import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketSettingsPageComponent } from './ticket-settings-page.component';
import { TicketSettingsPageRoutingModule } from './ticket-settings-page-routing.module';



@NgModule({
    declarations: [
        TicketSettingsPageComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        TicketSettingsPageRoutingModule
    ],



})
export class TicketSettingsPageModule { }
