import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketProfileUpdatesServiceDurationComponent } from './ticket-profile-updates-service-duration.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    declarations: [TicketProfileUpdatesServiceDurationComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
    ],
    exports: [TicketProfileUpdatesServiceDurationComponent]


})
export class TicketProfileUpdatesServiceDurationModule { }
