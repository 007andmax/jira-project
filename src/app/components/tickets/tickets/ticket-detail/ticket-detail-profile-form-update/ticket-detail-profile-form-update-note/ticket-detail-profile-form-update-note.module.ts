import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadAreaProgressModule } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.module';
import { TicketDetailProfileFormUpdateNoteComponent } from './ticket-detail-profile-form-update-note.component';

@NgModule({
    declarations: [
        TicketDetailProfileFormUpdateNoteComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        UploadAreaProgressModule
    ],
    exports: [TicketDetailProfileFormUpdateNoteComponent],

})
export class TicketDetailProfileFormUpdateNoteModule { }
