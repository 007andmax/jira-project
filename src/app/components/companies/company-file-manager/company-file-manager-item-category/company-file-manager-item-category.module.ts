import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { DblclickModule } from 'src/app/directives/dblclick/dblclick.module';
import { CompanyFileManagerItemCategoryComponent } from './company-file-manager-item-category.component';

@NgModule({
    declarations: [CompanyFileManagerItemCategoryComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        DblclickModule
    ],
    exports: [CompanyFileManagerItemCategoryComponent]
})
export class CompanyFileManagerItemCategoryModule { }
