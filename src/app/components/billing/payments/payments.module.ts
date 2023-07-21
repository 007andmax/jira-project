import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsComponent } from './payments.component';
import { PaymentsHeaderComponent } from './payments-header/payments-header.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PaymentItemComponent } from './payment-item/payment-item.component';
import { RefundPaymentComponent } from './refund-payment/refund-payment.component';
import { PaymentsAsideComponent } from './payments-aside/payments-aside.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { PaymentsFilterComponent } from './payments-header/payments-filter/payments-filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';
import { PaymentsRoutingModule } from './payments-routing.module';
import { PreviewPhoneMaskModule } from '../../shared/preview-phone-mask/preview-phone-mask.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { InvoiceExportModule } from '../invoices/invoices-header/invoice-export/invoice-export.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';





@NgModule({
    declarations: [PaymentsComponent,
        PaymentsHeaderComponent,
        PaymentItemComponent,
        RefundPaymentComponent,
        PaymentsAsideComponent,
        EditPaymentComponent,
        PaymentsFilterComponent,


    ],
    imports: [
        CommonModule,
        InfiniteScrollModule,
        NgbModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        DatePickerModule,
        NumberModule,
        MatSelectModule,
        MatChipsModule,
        MultiDatepickerModule,
        PaymentsRoutingModule,
        PreviewPhoneMaskModule,
        KeyUpEnterModule,
        InvoiceExportModule,
        CompanyDropDownModule,
        DropDownModule
    ],



})
export class PaymentsModule { }
