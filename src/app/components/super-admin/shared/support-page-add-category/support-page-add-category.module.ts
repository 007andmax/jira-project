import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportPageAddCategoryComponent } from './support-page-add-category.component';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { MatFormFieldModule } from '@angular/material';
import { FormsModule } from '@angular/forms';




@NgModule({
    declarations: [SupportPageAddCategoryComponent
    ],
    imports: [
        CommonModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        MatFormFieldModule,
        FormsModule,
    ],
    entryComponents: [SupportPageAddCategoryComponent],
    exports: [SupportPageAddCategoryComponent]
})
export class SupportPageAddCategoryModule { }
