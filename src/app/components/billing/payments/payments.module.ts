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
import { SelectSearchModule } from '../../shared/select-search/select-search.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { MatSelectModule, MatChipsModule } from '@angular/material';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';
import { PaymentsRoutingModule } from './payments-routing.module';





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
        SelectSearchModule,
        DatePickerModule,
        NumberModule,
        MatSelectModule,
        MatChipsModule,
        MultiDatepickerModule,
        PaymentsRoutingModule
    ],



})
export class PaymentsModule { }
