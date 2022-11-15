import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DraftEmailUserRecipientsComponent } from './draft-email-user-recipients.component';
import { DropDownModule } from '../../drop-down/drop-down.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule, MatIconModule, MatSelectModule } from '@angular/material';


@NgModule({
    declarations: [DraftEmailUserRecipientsComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        ReactiveFormsModule,
    ],
    exports: [DraftEmailUserRecipientsComponent]


})
export class DraftEmailUserRecipientsModule { }
