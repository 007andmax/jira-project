import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { FileManagerAddCategoryModule } from 'src/app/components/file-manager/file-manager-add-category/file-manager-add-category.module';
import { CompanyFileManagerHeaderComponent } from './company-file-manager-header.component';
import { MatFormFieldModule } from '@angular/material';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';

@NgModule({
    declarations: [CompanyFileManagerHeaderComponent,

    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        DropDownModule,
        FileManagerAddCategoryModule
    ],
    exports: [CompanyFileManagerHeaderComponent]
})
export class CompanyFileManagerHeaderModule { }
