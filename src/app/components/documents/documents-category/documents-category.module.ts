import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsCategoryComponent } from './documents-category.component';



import { DocumentsCategoryRoutingModule } from './documents-category-routing.module';



@NgModule({
    imports: [
    CommonModule,
    DocumentsCategoryRoutingModule,
    DocumentsCategoryComponent
],
})
export class DocumentsCategoryModule { }
