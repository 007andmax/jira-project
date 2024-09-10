import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketProfileUpdatesServiceTimepickerComponent } from './ticket-profile-updates-service-timepicker.component';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';



@NgModule({
    declarations: [
        TicketProfileUpdatesServiceTimepickerComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        MatErrorModule
    ],
    exports: [TicketProfileUpdatesServiceTimepickerComponent]



})
export class TicketProfileUpdatesServiceTimepickerModule { }
