import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordManagerAddCategoryComponent } from '../password-manager-add-category/password-manager-add-category.component';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';


@NgModule({
    declarations: [PasswordManagerAddCategoryComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatChipsModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule
    ],
    exports: [PasswordManagerAddCategoryComponent]


})
export class PasswordManagerAddCategoryModule { }
