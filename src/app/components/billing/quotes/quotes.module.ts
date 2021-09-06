import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotesComponent } from './quotes.component';
import { QuotesTableComponent } from './quotes-table/quotes-table.component';
import { QuoteAsidePreviewComponent } from './quote-aside-preview/quote-aside-preview.component';
import { QuoteAsideAddComponent } from './quote-aside-add/quote-aside-add.component';
import { QuoteAsideEditComponent } from './quote-aside-edit/quote-aside-edit.component';
import { QuotesHeaderComponent } from './quotes-header/quotes-header.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QuotesItemComponent } from './quotes-table/quotes-item/quotes-item.component';
import { QuoteAsidePreviewBodyComponent } from './quote-aside-preview/quote-aside-preview-body/quote-aside-preview-body.component';
import { QuoteAsideAddBodyComponent } from './quote-aside-add/quote-aside-add-body/quote-aside-add-body.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { QuoteAsideEditBodyComponent } from './quote-aside-edit/quote-aside-edit-body/quote-aside-edit-body.component';
import { QuotesFilterComponent } from './quotes-header/quotes-filter/quotes-filter.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { InvoiceFormEditCustomerModule } from '../billable/billable-aside/invoice-form/invoice-form-edit-customer/invoice-form-edit-customer.module';
import { FormsModule } from '@angular/forms';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { ServiceItemQuoteComponent } from './quote-aside-add/service-item-quote/service-item-quote.component';
import { ProductItemQuoteComponent } from './quote-aside-add/product-item-quote/product-item-quote.component';
import { ProductListQuoteComponent } from './quote-aside-add/product-list-quote/product-list-quote.component';
import { ServiceListQuoteComponent } from './quote-aside-add/service-list-quote/service-list-quote.component';
import { InvoiceRegularNoteModule } from '../billable/billable-aside/invoice-form/invoice-regular-note/invoice-regular-note.module';
import { ProductItemQuoteEditComponent } from './quote-aside-edit/product-item-quote-edit/product-item-quote-edit.component';
import { SelectSearchModule } from '../../shared/select-search/select-search.module';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { FilterModule } from 'src/app/pipe/filter/filter.module';
import { QuotesRoutingModule } from './quotes-routing.module';




@NgModule({
    declarations: [QuotesComponent,
        QuotesTableComponent,
        QuoteAsidePreviewComponent,
        QuoteAsideAddComponent,
        QuoteAsideEditComponent,
        QuotesHeaderComponent,
        QuotesItemComponent,
        QuoteAsidePreviewBodyComponent,
        QuoteAsideAddBodyComponent,
        QuoteAsideEditBodyComponent,
        QuotesFilterComponent,
        ServiceItemQuoteComponent,
        ProductItemQuoteComponent,
        ProductListQuoteComponent,
        ServiceListQuoteComponent,
        ProductItemQuoteEditComponent

    ],
    imports: [
        CommonModule,
        InfiniteScrollModule,
        NgbModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        DropDownModule,
        InvoiceFormEditCustomerModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
        DatePickerModule,
        InvoiceRegularNoteModule,
        SelectSearchModule,
        MultiDatepickerModule,
        DecimalNumberModule,
        FilterModule,
        QuotesRoutingModule
    ],



})
export class QuotesModule { }
