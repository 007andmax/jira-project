import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraftEmailComponent } from './draft-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DraftEmailRecipientsComponent } from './draft-email-recipients/draft-email-recipients.component';
import { DraftEmailUserRecipientsModule } from './draft-email-user-recipients/draft-email-user-recipients.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../preloader-ticket/preloader-ticket.module';
import { UploadAreaModule } from '../upload-area/upload-area.module';
import { DndModule } from 'src/app/directives/dnd/dnd.module';
import { MatChipModule } from '../mat-chip/mat-chip.module';
import { MatChipListModule } from '../mat-chip-list/mat-chip-list.module';
import { MatFormFieldModule } from '../mat-form-field/mat-form-field.module';
import { MatErrorModule } from '../mat-error/mat-error.module';


@NgModule({
    declarations: [DraftEmailComponent,
        DraftEmailRecipientsComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        DraftEmailUserRecipientsModule,
        AngularEditorModule,
        NgbModule,
        ReactiveFormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        UploadAreaModule,
        DndModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule
    ],
    exports: [DraftEmailComponent]


})
export class DraftEmailModule { }
