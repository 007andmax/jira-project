import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketProfileUpdatesServiceDurationComponent } from './ticket-profile-updates-service-duration.component';
import { IgxTimePickerModule } from 'igniteui-angular';
import { MatChipsModule, MatSelectModule } from '@angular/material';



@NgModule({
    declarations: [TicketProfileUpdatesServiceDurationComponent
    ],
    imports: [
        CommonModule,
        IgxTimePickerModule,
        MatSelectModule,
        MatChipsModule,
    ],
    exports: [TicketProfileUpdatesServiceDurationComponent]


})
export class TicketProfileUpdatesServiceDurationModule { }
