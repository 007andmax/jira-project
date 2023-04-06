import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketProfileFormUpdateNoteListComponent } from './ticket-profile-form-update-note-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        TicketProfileFormUpdateNoteListComponent
    ],
    imports: [
        CommonModule,
        NgbModule,

    ],
    exports: [TicketProfileFormUpdateNoteListComponent]



})
export class TicketProfileFormUpdateNoteListModule { }
