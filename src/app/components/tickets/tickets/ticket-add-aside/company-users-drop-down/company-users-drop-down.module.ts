import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyUsersDropDownComponent } from './company-users-drop-down.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    declarations: [CompanyUsersDropDownComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        NgbModule,

    ],
    exports: [CompanyUsersDropDownComponent]
})
export class CompanyUsersDropDownModule { }
