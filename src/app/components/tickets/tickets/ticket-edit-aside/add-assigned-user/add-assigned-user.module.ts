import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAssignedUserComponent } from './add-assigned-user.component';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';



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

    ],
    exports: [AddAssignedUserComponent]



})
export class AddAssignedUserModule { }
