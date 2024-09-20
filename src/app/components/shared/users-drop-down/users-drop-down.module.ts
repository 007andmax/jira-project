import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersDropDownComponent } from './users-drop-down.component';



@NgModule({
    declarations: [UsersDropDownComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        NgbModule,

    ],
    exports: [UsersDropDownComponent]
})
export class UsersDropDownModule { }
