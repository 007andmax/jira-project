import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketProfileUpdatesServiceTimepickerComponent } from './ticket-profile-updates-service-timepicker.component';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';



@NgModule({
    declarations: [
        TicketProfileUpdatesServiceTimepickerComponent
    ],
    imports: [
        CommonModule,
        MatErrorModule
    ],
    exports: [TicketProfileUpdatesServiceTimepickerComponent]



})
export class TicketProfileUpdatesServiceTimepickerModule { }
