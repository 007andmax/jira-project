import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportPageAddCategoryComponent } from './support-page-add-category.component';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { FormsModule } from '@angular/forms';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';




@NgModule({
    declarations: [SupportPageAddCategoryComponent
    ],
    imports: [
        CommonModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        MatFormFieldModule,
        FormsModule,
        MatErrorModule
    ],
    exports: [SupportPageAddCategoryComponent]
})
export class SupportPageAddCategoryModule { }
