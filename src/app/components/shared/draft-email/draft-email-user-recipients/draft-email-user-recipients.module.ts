import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DraftEmailUserRecipientsComponent } from './draft-email-user-recipients.component';
import { DropDownModule } from '../../drop-down/drop-down.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule, MatFormFieldModule, MatIconModule, MatSelectModule } from '@angular/material';
import { MatChipListModule } from '../../mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../../mat-chip/mat-chip.module';


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
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
    ],
    exports: [DraftEmailUserRecipientsComponent]


})
export class DraftEmailUserRecipientsModule { }
