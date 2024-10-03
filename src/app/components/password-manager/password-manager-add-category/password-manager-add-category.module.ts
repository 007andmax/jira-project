import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordManagerAddCategoryComponent } from '../password-manager-add-category/password-manager-add-category.component';
import { FormsModule } from '@angular/forms';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';


@NgModule({
    declarations: [PasswordManagerAddCategoryComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        MatErrorModule
    ],
    exports: [PasswordManagerAddCategoryComponent]


})
export class PasswordManagerAddCategoryModule { }
