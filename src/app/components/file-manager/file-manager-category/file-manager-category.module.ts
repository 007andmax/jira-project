import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { FileManagementCategoryRoutingModule } from './file-manager-category-routing.module';
import { FileManagerCategoryComponent } from './file-manager-category.component';





@NgModule({
    imports: [
    CommonModule,
    FileManagementCategoryRoutingModule,
    FormsModule,
    NgbModule,
    FileManagerCategoryComponent
],
})
export class FileManagementCategoryModule { }
