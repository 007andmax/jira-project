import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { InvoicesHeaderComponent } from './invoices-header/invoices-header.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InvoicesItemComponent } from './invoices-item/invoices-item.component';
import { InvoicesFilterComponent } from './invoices-header/invoices-filter/invoices-filter.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InvoicesRoutingModule } from './invoices-routing.module';

import { InvoiceExportComponent } from './invoices-header/invoice-export/invoice-export.component';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { InvoiceExportModule } from './invoices-header/invoice-export/invoice-export.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { CompanyLogoPopoverModule } from 'src/app/directives/company-logo-popover/company-logo-popover.module';
import { UsersTableCompanyByModule } from '../../users/users-table/users-table-company-by/users-table-company-by.module';



@NgModule({
    imports: [
        CommonModule,
        InfiniteScrollModule,
        FormsModule,
        NgbModule,
        MultiDatepickerModule,
        InvoicesRoutingModule,
        KeyUpEnterModule,
        DynamicTooltipModule,
        InvoiceExportModule,
        CompanyDropDownModule,
        DropDownModule,
        CompanyLogoPopoverModule,
        UsersTableCompanyByModule
    ],



})
export class InvoicesModule { }
