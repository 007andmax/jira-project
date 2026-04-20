import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { CompanyProductsComponent } from './company-products.component';


import { FormsModule } from '@angular/forms';
import { CompanyProductsRoutingModule } from './company-products-routing.module';

@NgModule({
    imports: [
    CommonModule,
    //  ReportAdditionalActionsModule,
    FormsModule,
    CompanyProductsRoutingModule,
    CompanyProductsComponent
],
})
export class CompanyProductsModule { }
