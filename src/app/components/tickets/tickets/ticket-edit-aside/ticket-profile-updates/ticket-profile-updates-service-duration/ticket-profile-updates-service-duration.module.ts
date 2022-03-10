import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketProfileUpdatesServiceDurationComponent } from './ticket-profile-updates-service-duration.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';



@NgModule({
    declarations: [TicketProfileUpdatesServiceDurationComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
    ],
    exports: [TicketProfileUpdatesServiceDurationComponent]


})
export class TicketProfileUpdatesServiceDurationModule { }
