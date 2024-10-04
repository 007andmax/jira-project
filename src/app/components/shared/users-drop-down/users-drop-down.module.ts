import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersDropDownComponent } from './users-drop-down.component';
import { MatErrorModule } from '../mat-error/mat-error.module';



@NgModule({
    declarations: [UsersDropDownComponent
    ],
    imports: [
        CommonModule,
        MatErrorModule,
        FormsModule,
        NgbModule,

    ],
    exports: [UsersDropDownComponent]
})
export class UsersDropDownModule { }
