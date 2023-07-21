import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketProfileUpdatesServiceDurationComponent } from './ticket-profile-updates-service-duration.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    declarations: [TicketProfileUpdatesServiceDurationComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        NgbModule,
    ],
    exports: [TicketProfileUpdatesServiceDurationComponent]


})
export class TicketProfileUpdatesServiceDurationModule { }
