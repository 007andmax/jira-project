import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerComponent } from './file-manager.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileManagementRoutingModule } from './file-manager-routing.module';
import { FileManagerCategoryComponent } from './file-manager-category/file-manager-category.component';
import { FileManagerHeaderComponent } from './file-manager-header/file-manager-header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { FileManagerItemFileComponent } from './file-manager-item-file/file-manager-item-file.component';
import { FileManagerItemCategoryComponent } from './file-manager-item-category/file-manager-item-category.component';



import { FileManagerAddFileComponent } from './file-manager-add-file/file-manager-add-file.component';

import { FileManagerAddCategoryComponent } from './file-manager-add-category/file-manager-add-category.component';
import { FileManagerCategoryRenameComponent } from './file-manager-category-rename/file-manager-category-rename.component';
import { FileManagerFileInfoComponent } from './file-manager-file-info/file-manager-file-info.component';
import { FileManagerFileInfoTagsComponent } from './file-manager-file-info/file-manager-file-info-tags/file-manager-file-info-tags.component';



import { FileManagerAllCustomerComponent } from './file-manager-all-customer/file-manager-all-customer.component';

import { FileManagerAllCustomerCompanyComponent } from './file-manager-all-customer-company/file-manager-all-customer-company.component';




@NgModule({
    imports: [
    CommonModule,
    FileManagementRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    FileManagerComponent, FileManagerCategoryRenameComponent
]
})
export class FileManagementModule { }
