import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketProfileAttachmentsComponent } from './ticket-profile-attachments.component';


@NgModule({
    declarations: [TicketProfileAttachmentsComponent
    ],
    imports: [
        CommonModule,

    ],
    exports: [TicketProfileAttachmentsComponent]

})
export class TicketProfileAttachmentsModule { }
