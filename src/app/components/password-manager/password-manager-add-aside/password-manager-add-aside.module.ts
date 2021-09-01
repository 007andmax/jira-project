import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PasswordManagerAddAsideComponent } from './password-manager-add-aside.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { PasswordManagerAddCategoryComponent } from '../password-manager-add-category/password-manager-add-category.component';
import { PasswordManagerAddCategoryModule } from '../password-manager-add-category/password-manager-add-category.module';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { PasswordManagerLinkedComponent } from './password-manager-linked/password-manager-linked.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';

@NgModule({
    declarations: [
        PasswordManagerAddAsideComponent,
        PasswordManagerLinkedComponent

    ],
    imports: [
        CommonModule,
        DropDownModule,
        FormsModule,
        TextAreaModule,
        PasswordManagerAddCategoryModule,
        MatSelectModule,
        MatChipsModule,
        DatePickerModule,
        DisabledBtnModule,
        PreloaderTicketModule

    ],
    exports: [PasswordManagerAddAsideComponent],


})
export class PasswordManagerAddAsideModule { }
