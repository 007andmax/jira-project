import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordManagerAddCategoryComponent } from '../password-manager-add-category/password-manager-add-category.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [PasswordManagerAddCategoryComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
    ],
    exports: [PasswordManagerAddCategoryComponent]


})
export class PasswordManagerAddCategoryModule { }
