import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAssignedUserComponent } from './add-assigned-user.component';
import { MatSelectModule, MatChipsModule, MatIconModule, MatFormFieldModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';



@NgModule({
    declarations: [
        AddAssignedUserComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        NgbModule,
        ReactiveFormsModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
    ],
    exports: [AddAssignedUserComponent]



})
export class AddAssignedUserModule { }
