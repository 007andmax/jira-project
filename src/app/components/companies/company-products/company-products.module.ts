import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { CompanyProductsComponent } from './company-products.component';
import { ReportMenuModule } from '../../reports/report-menu/report-menu.module';
import { ReportAdditionalActionsModule } from '../../reports/report-additional-actions/report-additional-actions.module';
import { FormsModule } from '@angular/forms';
import { ReportFooterModule } from '../../reports/report-footer/report-footer.module';
import { CompanyProductsRoutingModule } from './company-products-routing.module';


@NgModule({
    declarations: [CompanyProductsComponent
    ],
    imports: [
        CommonModule,
        ReportMenuModule,
        ReportAdditionalActionsModule,
        FormsModule,
        ReportFooterModule,
        CompanyProductsRoutingModule
    ],



})
export class CompanyProductsModule { }
