import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { SupportPageAddSubCategoryComponent } from './support-page-add-sub-category.component';




@NgModule({
    declarations: [SupportPageAddSubCategoryComponent
    ],
    imports: [
        CommonModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        MatFormFieldModule,
        FormsModule,
    ],
    entryComponents: [SupportPageAddSubCategoryComponent],
    exports: [SupportPageAddSubCategoryComponent]
})
export class SupportPageAddSubCategoryModule { }
