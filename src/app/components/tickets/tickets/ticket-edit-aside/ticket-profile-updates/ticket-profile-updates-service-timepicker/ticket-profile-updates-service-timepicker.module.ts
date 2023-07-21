import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketProfileUpdatesServiceTimepickerComponent } from './ticket-profile-updates-service-timepicker.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
    declarations: [
        TicketProfileUpdatesServiceTimepickerComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,

    ],
    exports: [TicketProfileUpdatesServiceTimepickerComponent]



})
export class TicketProfileUpdatesServiceTimepickerModule { }
