import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { FileManagementFileInfoModule } from 'src/app/components/file-manager/file-manager-file-info/file-manager-file-info.module';
import { FileManagementHeaderModule } from 'src/app/components/file-manager/file-manager-header/file-manager-header.module';
import { FileManagementItemCategoryModule } from 'src/app/components/file-manager/file-manager-item-category/file-manager-item-category.module';
import { FileManagementItemFileModule } from 'src/app/components/file-manager/file-manager-item-file/file-manager-item-file.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { CompanyFileManagerCategoryRoutingModule } from './company-file-manager-category-routing.module';
import { CompanyFileManagerCategoryComponent } from './company-file-manager-category.component';
import { CompanyFileManagerHeaderModule } from '../company-file-manager-header/company-file-manager-header.module';
import { CompanyFileManagerItemCategoryModule } from '../company-file-manager-item-category/company-file-manager-item-category.module';

@NgModule({
    declarations: [CompanyFileManagerCategoryComponent

    ],
    imports: [
        CommonModule,
        CompanyFileManagerCategoryRoutingModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        CompanyFileManagerItemCategoryModule,
        FileManagementItemFileModule,
        CompanyFileManagerHeaderModule,
        FileManagementFileInfoModule
    ],
})
export class CompanyFileManagerCategoryModule { }
