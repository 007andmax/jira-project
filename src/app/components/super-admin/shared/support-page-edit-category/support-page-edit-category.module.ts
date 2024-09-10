import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { MatFormFieldModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SupportPageEditCategoryComponent } from './support-page-edit-category.component';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';




@NgModule({
    declarations: [SupportPageEditCategoryComponent
    ],
    imports: [
        CommonModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        MatFormFieldModule,
        FormsModule,
        MatErrorModule
    ],
    entryComponents: [SupportPageEditCategoryComponent],
    exports: [SupportPageEditCategoryComponent]
})
export class SupportPageEditCategoryModule { }
