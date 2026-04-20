import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';






import { CompanyFileManagerCategoryRoutingModule } from './company-file-manager-category-routing.module';
import { CompanyFileManagerCategoryComponent } from './company-file-manager-category.component';



@NgModule({
    imports: [
    CommonModule,
    CompanyFileManagerCategoryRoutingModule,
    FormsModule,
    NgbModule,
    CompanyFileManagerCategoryComponent
],
})
export class CompanyFileManagerCategoryModule { }
