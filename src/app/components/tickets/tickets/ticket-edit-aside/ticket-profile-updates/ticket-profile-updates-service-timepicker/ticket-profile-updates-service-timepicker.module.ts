import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketProfileUpdatesServiceTimepickerComponent } from './ticket-profile-updates-service-timepicker.component';
import { MatSelectModule, MatChipsModule } from '@angular/material';



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
