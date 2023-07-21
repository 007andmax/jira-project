import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAssignedUserComponent } from './add-assigned-user.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
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
