import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddAssignedUserNoteComponent } from './add-assigned-user-note.component';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';

@NgModule({
    declarations: [
        AddAssignedUserNoteComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule,
        ReactiveFormsModule
    ],
    exports: [AddAssignedUserNoteComponent],

})
export class AddAssignedUserNoteModule { }
