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







@NgModule({
    imports: [
    CommonModule,
    InfiniteScrollModule,
    FormsModule,
    NgbModule,
    InvoicesRoutingModule,
    InvoicesComponent,
    InvoicesHeaderComponent,
    InvoicesItemComponent,
    InvoicesFilterComponent
],
})
export class InvoicesModule { }
