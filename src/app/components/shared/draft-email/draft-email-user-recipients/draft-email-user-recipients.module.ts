import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DraftEmailUserRecipientsComponent } from './draft-email-user-recipients.component';
import { DropDownModule } from '../../drop-down/drop-down.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipListModule } from '../../mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../../mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../mat-form-field/mat-form-field.module';
import { MatErrorModule } from '../../mat-error/mat-error.module';


@NgModule({
    declarations: [DraftEmailUserRecipientsComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        MatChipModule,
        MatChipListModule,
        MatFormFieldModule,
        MatErrorModule
    ],
    exports: [DraftEmailUserRecipientsComponent]


})
export class DraftEmailUserRecipientsModule { }
