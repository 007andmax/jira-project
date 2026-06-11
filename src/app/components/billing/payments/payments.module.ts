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





import { PaymentsRoutingModule } from './payments-routing.module';
import { PreviewPhoneMaskModule } from '../../shared/preview-phone-mask/preview-phone-mask.module';





import { PaymentsCardsComponent } from './payments-cards/payments-cards.component';
import { PaymentItemCompanyComponent } from './payment-item/payment-item-company/payment-item-company.component';
import { CompanyLogoPopoverModule } from 'src/app/directives/company-logo-popover/company-logo-popover.module';
import { UsersTableCompanyByModule } from '../../users/users-table/users-table-company-by/users-table-company-by.module';





@NgModule({
    declarations: [PaymentsComponent,
        PaymentsHeaderComponent,
        PaymentItemComponent,
        RefundPaymentComponent,
        PaymentsAsideComponent,
        EditPaymentComponent,
        PaymentsFilterComponent,
        PaymentItemCompanyComponent,

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
        MultiDatepickerModule,
        PaymentsRoutingModule,
        PreviewPhoneMaskModule,
        KeyUpEnterModule,
        InvoiceExportModule,
        CompanyDropDownModule,
        DropDownModule,
        MatErrorModule,
        CompanyLogoPopoverModule,
        UsersTableCompanyByModule
    ],



})
export class PaymentsModule { }
