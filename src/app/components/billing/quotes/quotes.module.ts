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


import { QuoteAsideEditBodyComponent } from './quote-aside-edit/quote-aside-edit-body/quote-aside-edit-body.component';
import { QuotesFilterComponent } from './quotes-header/quotes-filter/quotes-filter.component';

import { InvoiceFormEditCustomerModule } from '../billable/billable-aside/invoice-form/invoice-form-edit-customer/invoice-form-edit-customer.module';
import { FormsModule } from '@angular/forms';

import { ServiceItemQuoteComponent } from './quote-aside-add/service-item-quote/service-item-quote.component';
import { ProductItemQuoteComponent } from './quote-aside-add/product-item-quote/product-item-quote.component';
import { ProductListQuoteComponent } from './quote-aside-add/product-list-quote/product-list-quote.component';
import { ServiceListQuoteComponent } from './quote-aside-add/service-list-quote/service-list-quote.component';

import { ProductItemQuoteEditComponent } from './quote-aside-edit/product-item-quote-edit/product-item-quote-edit.component';



import { QuotesRoutingModule } from './quotes-routing.module';
import { PreviewPhoneMaskModule } from '../../shared/preview-phone-mask/preview-phone-mask.module';

import { InvoiceChangeAddressModule } from '../billable/billable-aside/invoice-form/invoice-change-address/invoice-change-address.module';
import { QuoteAsideAddChangeAddressComponent } from './quote-aside-add/quote-aside-add-change-address/quote-aside-add-change-address.component';




import { QuoteAsidePreviewBodyModule } from './quote-aside-preview/quote-aside-preview-body/quote-aside-preview-body.module';




@NgModule({
    imports: [
    CommonModule,
    InfiniteScrollModule,
    NgbModule,
    InvoiceFormEditCustomerModule,
    FormsModule,
    QuotesRoutingModule,
    PreviewPhoneMaskModule,
    InvoiceChangeAddressModule,
    QuoteAsidePreviewBodyModule,
    QuotesComponent,
    QuotesTableComponent,
    QuoteAsideAddComponent,
    QuoteAsideEditComponent,
    QuotesHeaderComponent,
    QuotesItemComponent,
    QuoteAsideAddBodyComponent,
    QuoteAsideEditBodyComponent,
    QuotesFilterComponent,
    ServiceItemQuoteComponent,
    ProductItemQuoteComponent,
    ProductListQuoteComponent,
    ServiceListQuoteComponent,
    ProductItemQuoteEditComponent,
    QuoteAsideAddChangeAddressComponent
],
})
export class QuotesModule { }
