import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDashboardComponent } from './company-dashboard.component';
import { CompanyDashDetailComponent } from './company-dash-detail/company-dash-detail.component';
import { CompanyDashAssociateComponent } from './company-dash-associate/company-dash-associate.component';
import { CompanyDashStatsComponent } from './company-dash-stats/company-dash-stats.component';
import { CompanyDashTicketComponent } from './company-dash-ticket/company-dash-ticket.component';
import { CompanyDashRevenueComponent } from './company-dash-revenue/company-dash-revenue.component';
import { CompanyDashInvoiceComponent } from './company-dash-invoice/company-dash-invoice.component';
import { CompanyDashContractComponent } from './company-dash-contract/company-dash-contract.component';
import { CompanyDashAssociateInfoComponent } from './company-dash-associate-info/company-dash-associate-info.component';

import { NgxMaskModule } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CompanyEditAsideModule } from '../companies/company-edit-aside/company-edit-aside.module';





import { CompanyDashboardRoutingModule } from './company-dashboard-routing.module';
import { PreviewPhoneMaskModule } from '../shared/preview-phone-mask/preview-phone-mask.module';

import { NgxChartsModule } from '@swimlane/ngx-charts';



@NgModule({
    declarations: [
        CompanyDashboardComponent,
        CompanyDashDetailComponent,
        CompanyDashAssociateComponent,
        CompanyDashStatsComponent,
        CompanyDashTicketComponent,
        CompanyDashRevenueComponent,
        CompanyDashInvoiceComponent,
        CompanyDashContractComponent,
        CompanyDashAssociateInfoComponent
    ],
    imports: [
    CommonModule,
    CompanyDashboardRoutingModule,
    NgxMaskModule.forRoot(),
    NgbModule,
    FormsModule,
    CompanyEditAsideModule,
    PreviewPhoneMaskModule,
    NgxChartsModule
],



})
export class CompanyDashboardModule { }
