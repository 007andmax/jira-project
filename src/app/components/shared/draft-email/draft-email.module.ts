import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraftEmailComponent } from './draft-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DraftEmailRecipientsComponent } from './draft-email-recipients/draft-email-recipients.component';
import { DraftEmailUserRecipientsModule } from './draft-email-user-recipients/draft-email-user-recipients.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule, MatFormFieldModule, MatIconModule } from '@angular/material';


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
        MatIconModule,
        MatChipsModule,
        ReactiveFormsModule,
        MatFormFieldModule
    ],
    exports: [DraftEmailComponent]


})
export class DraftEmailModule { }
