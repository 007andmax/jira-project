import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAssignedUserComponent } from './add-assigned-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatOptionModule } from 'src/app/components/shared/mat-option/mat-option.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';



@NgModule({
    declarations: [
        AddAssignedUserComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatOptionModule
    ],
    exports: [AddAssignedUserComponent]



})
export class AddAssignedUserModule { }
