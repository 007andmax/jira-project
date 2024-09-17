import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyUsersDropDownComponent } from './company-users-drop-down.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';



@NgModule({
    declarations: [CompanyUsersDropDownComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        MatErrorModule
    ],
    exports: [CompanyUsersDropDownComponent]
})
export class CompanyUsersDropDownModule { }
