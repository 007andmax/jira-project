import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardBillingComponent } from './dashboard-billing.component';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { DashboardStatsModule } from './dashboard-stats/dashboard-stats.module';
import { DashboardSalesAnalyticsComponent } from './dashboard-sales-analytics/dashboard-sales-analytics.component';
import { InvoiceRevenueComponent } from './invoice-revenue/invoice-revenue.component';
import { DashboardQuotesComponent } from './dashboard-quotes/dashboard-quotes.component';
import { ContractsDashboardComponent } from './contracts-dashboard/contracts-dashboard.component';
import { TopDashboardComponent } from './top-dashboard/top-dashboard.component';
import { TopProductDashboardComponent } from './top-product-dashboard/top-product-dashboard.component';
import { NvD3Module } from 'ng2-nvd3';
import { MultiDatepickerDashboardComponent } from './multi-datepicker-dashboard/multi-datepicker-dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardBillingRoutingModule } from './dashboard-billing-routing.module';



@NgModule({
    declarations: [DashboardBillingComponent,
        DashboardSalesAnalyticsComponent,
        InvoiceRevenueComponent,
        DashboardQuotesComponent,
        ContractsDashboardComponent,
        TopDashboardComponent,
        TopProductDashboardComponent,
        MultiDatepickerDashboardComponent

    ],
    imports: [
        CommonModule,
        DatePickerModule,
        DashboardStatsModule,
        NvD3Module,
        NgbModule,
        DashboardBillingRoutingModule

    ],



})
export class DashboardBillingModule { }
