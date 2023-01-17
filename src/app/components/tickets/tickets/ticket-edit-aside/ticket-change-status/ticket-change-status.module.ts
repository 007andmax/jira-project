import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketChangeStatusComponent } from './ticket-change-status.component';


@NgModule({
    declarations: [
        TicketChangeStatusComponent

    ],
    imports: [
        CommonModule,
        NgbModule
    ],
    exports: [TicketChangeStatusComponent]


})
export class TicketChangeStatusModule { }
