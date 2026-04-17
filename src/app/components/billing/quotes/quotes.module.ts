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
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { ServiceItemQuoteComponent } from './quote-aside-add/service-item-quote/service-item-quote.component';
import { ProductItemQuoteComponent } from './quote-aside-add/product-item-quote/product-item-quote.component';
import { ProductListQuoteComponent } from './quote-aside-add/product-list-quote/product-list-quote.component';
import { ServiceListQuoteComponent } from './quote-aside-add/service-list-quote/service-list-quote.component';
import { InvoiceRegularNoteModule } from '../billable/billable-aside/invoice-form/invoice-regular-note/invoice-regular-note.module';
import { ProductItemQuoteEditComponent } from './quote-aside-edit/product-item-quote-edit/product-item-quote-edit.component';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { FilterModule } from 'src/app/pipe/filter/filter.module';
import { QuotesRoutingModule } from './quotes-routing.module';
import { PreviewPhoneMaskModule } from '../../shared/preview-phone-mask/preview-phone-mask.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { InvoiceChangeAddressModule } from '../billable/billable-aside/invoice-form/invoice-change-address/invoice-change-address.module';
import { QuoteAsideAddChangeAddressComponent } from './quote-aside-add/quote-aside-add-change-address/quote-aside-add-change-address.component';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { QuoteAsidePreviewBodyModule } from './quote-aside-preview/quote-aside-preview-body/quote-aside-preview-body.module';
import { TicketsTableItemRequestedByModule } from '../../tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';
import { UserLogoPopoverModule } from 'src/app/directives/user-logo-popover/user-logo-popover.module';
import { CompanyLogoPopoverModule } from 'src/app/directives/company-logo-popover/company-logo-popover.module';
import { UsersTableCompanyByModule } from '../../users/users-table/users-table-company-by/users-table-company-by.module';




@NgModule({
    declarations: [QuotesComponent,
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
    imports: [
        CommonModule,
        InfiniteScrollModule,
        NgbModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        DropDownModule,
        InvoiceFormEditCustomerModule,
        FormsModule,
        DatePickerModule,
        InvoiceRegularNoteModule,
        MultiDatepickerModule,
        DecimalNumberModule,
        FilterModule,
        QuotesRoutingModule,
        PreviewPhoneMaskModule,
        KeyUpEnterModule,
        InvoiceChangeAddressModule,
        CompanyDropDownModule,
        NumberModule,
        MatErrorModule,
        TextAreaModule,
        QuoteAsidePreviewBodyModule,
        TicketsTableItemRequestedByModule,
        UserLogoPopoverModule,
        CompanyLogoPopoverModule,
        UsersTableCompanyByModule
    ],

})
export class QuotesModule { }
