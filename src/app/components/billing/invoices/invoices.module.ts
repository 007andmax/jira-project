import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { InvoicesHeaderComponent } from './invoices-header/invoices-header.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InvoicesItemComponent } from './invoices-item/invoices-item.component';
import { InvoicesFilterComponent } from './invoices-header/invoices-filter/invoices-filter.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectSearchModule } from '../../shared/select-search/select-search.module';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { InvoiceExportComponent } from './invoices-header/invoice-export/invoice-export.component';



@NgModule({
    declarations: [InvoicesComponent,
        InvoicesHeaderComponent,
        InvoicesItemComponent,
        InvoicesFilterComponent,
        InvoiceExportComponent

    ],
    imports: [
        CommonModule,
        InfiniteScrollModule,
        FormsModule,
        NgbModule,
        SelectSearchModule,
        MultiDatepickerModule,
        InvoicesRoutingModule,
        KeyUpEnterModule
    ],



})
export class InvoicesModule { }
