import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';







import { FileManagementRoutingModule } from '../../file-manager/file-manager-routing.module';

import { CompanyFileManagerComponent } from './company-file-manager.component';
import { CompanyFileManagerRoutingModule } from './company-file-manager-routing.module';
import { CompanyFileManagerCategoryComponent } from './company-file-manager-category/company-file-manager-category.component';
import { CompanyFileManagerHeaderComponent } from './company-file-manager-header/company-file-manager-header.component';

import { CompanyFileManagerItemCategoryComponent } from './company-file-manager-item-category/company-file-manager-item-category.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    CompanyFileManagerRoutingModule,
    CompanyFileManagerComponent
],
})
export class CompanyFileManagerModule { }
