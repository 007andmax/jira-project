import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddAssignedUserNoteModule } from './add-assigned-user-note/add-assigned-user-note.module';
import { TicketDetailProfileFormUpdateHeaderComponent } from './ticket-detail-profile-form-update-header.component';

@NgModule({
    declarations: [
        TicketDetailProfileFormUpdateHeaderComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        AddAssignedUserNoteModule
    ],
    exports: [TicketDetailProfileFormUpdateHeaderComponent],

})
export class TicketDetailProfileFormUpdateHeaderModule { }
