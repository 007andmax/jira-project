import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagementComponent } from './file-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagementRoutingModule } from './file-management-routing.module';
import { FileManagementCategoryComponent } from './file-management-category/file-management-category.component';
import { FileManagementHeaderComponent } from './file-management-header/file-management-header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../shared/preloader-ticket/preloader-ticket.module';
import { FileManagementItemFileComponent } from './file-management-item-file/file-management-item-file.component';
import { FileManagementItemCategoryComponent } from './file-management-item-category/file-management-item-category.component';
import { FileManagementItemCategoryModule } from './file-management-item-category/file-management-item-category.module';
import { FileManagementItemFileModule } from './file-management-item-file/file-management-item-file.module';
import { FileManagementHeaderModule } from './file-management-header/file-management-header.module';
import { FileManagementAddFileComponent } from './file-management-add-file/file-management-add-file.component';
import { FileManagementAddFileModule } from './file-management-add-file/file-management-add-file.module';
import { FileManagementAddCategoryComponent } from './file-management-add-category/file-management-add-category.component';
import { FileManagementCategoryRenameComponent } from './file-management-category-rename/file-management-category-rename.component';
import { FileManagementFileInfoComponent } from './file-management-file-info/file-management-file-info.component';
import { FileManagementFileInfoTagsComponent } from './file-management-file-info/file-management-file-info-tags/file-management-file-info-tags.component';
import { MatSelectModule, MatChipsModule, MatIconModule } from '@angular/material';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { DblclickModule } from 'src/app/directives/dblclick/dblclick.module';
import { FileManagementAllCustomerComponent } from './file-management-all-customer/file-management-all-customer.component';
import { FileManagementFileInfoModule } from './file-management-file-info/file-management-file-info.module';

@NgModule({
    declarations: [FileManagementComponent, FileManagementCategoryRenameComponent,

    ],
    imports: [
        CommonModule,
        FileManagementRoutingModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        FileManagementItemCategoryModule,
        FileManagementItemFileModule,
        FileManagementHeaderModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        TextAreaModule,
        KeyUpEnterModule,
        FileManagementFileInfoModule
    ],
    entryComponents: [
        FileManagementCategoryRenameComponent
    ]
})
export class FileManagementModule { }
