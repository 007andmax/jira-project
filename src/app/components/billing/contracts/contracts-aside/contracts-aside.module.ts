import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsAsideComponent } from './contracts-aside.component';
import { ContractsAsideSelectTypeComponent } from './contracts-aside-select-type/contracts-aside-select-type.component';
import { ContractsAsideHourlyBillingComponent } from './contracts-aside-hourly-billing/contracts-aside-hourly-billing.component';
import { ContractsAsideBlockTimeBillingComponent } from './contracts-aside-block-time-billing/contracts-aside-block-time-billing.component';
import { ContractsAsideUserDeviceBillingComponent } from './contracts-aside-user-device-billing/contracts-aside-user-device-billing.component';
import { ContractsAsideProductServiceContractsComponent } from './contracts-aside-product-service-contracts/contracts-aside-product-service-contracts.component';
import { ContractsAsideTopComponent } from './contracts-aside-top/contracts-aside-top.component';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { FormsModule } from '@angular/forms';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContractsAsideHourlyBillingDefaultServiceComponent } from './contracts-aside-hourly-billing/contracts-aside-hourly-billing-default-service/contracts-aside-hourly-billing-default-service.component';
import { ContractsAsideEditHourlyAddDefaultServiceModule } from '../contracts-edit/contracts-aside-hourly-edit/contracts-aside-edit-hourly-add-default-service/contracts-aside-edit-hourly-add-default-service.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { InvoiceFormTicketEditTaxesModule } from '../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { ContractsAsideBlockTimeBillingCustomerServiceModule } from './contracts-aside-block-time-billing/contracts-aside-block-time-billing-customer-service/contracts-aside-block-time-billing-customer-service.module';
import { ContractsAsideBlockTimeBillingDefaultServiceModule } from './contracts-aside-block-time-billing/contracts-aside-block-time-billing-default-service/contracts-aside-block-time-billing-default-service.module';
import { ContractsAsideBlockTimeBillingAddDefaultServiceModule } from './contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-default-service/contracts-aside-block-time-billing-add-default-service.module';
import { TehUsersModule } from 'src/app/components/shared/teh-users/teh-users.module';
import { ContractsAsideBlockTimeBillingUsersModule } from './contracts-aside-block-time-billing/contracts-aside-block-time-billing-users/contracts-aside-block-time-billing-users.module';
import { ContractsAsideUserDeviceServiceModule } from './contracts-aside-user-device-billing/contracts-aside-user-device-service/contracts-aside-user-device-service.module';
import { ContractsAsideOtherServiceModule } from './contracts-aside-product-service-contracts/contracts-aside-other-service/contracts-aside-other-service.module';
import { ContractsAsideOtherProductModule } from './contracts-aside-product-service-contracts/contracts-aside-other-product/contracts-aside-other-product.module';
import { NumberModule } from 'src/app/directives/number/number.module';


@NgModule({
    declarations: [ContractsAsideComponent,
        ContractsAsideSelectTypeComponent,
        ContractsAsideHourlyBillingComponent,
        ContractsAsideBlockTimeBillingComponent,
        ContractsAsideUserDeviceBillingComponent,
        ContractsAsideProductServiceContractsComponent,
        ContractsAsideTopComponent,
        ContractsAsideHourlyBillingDefaultServiceComponent

    ],
    imports: [
        CommonModule,
        DropDownModule,
        DatePickerModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
        NgbModule,
        ContractsAsideEditHourlyAddDefaultServiceModule,
        DecimalNumberModule,
        InvoiceFormTicketEditTaxesModule,
        ContractsAsideBlockTimeBillingCustomerServiceModule,
        ContractsAsideBlockTimeBillingDefaultServiceModule,
        ContractsAsideBlockTimeBillingAddDefaultServiceModule,
        TehUsersModule,
        ContractsAsideBlockTimeBillingUsersModule,
        ContractsAsideUserDeviceServiceModule,
        ContractsAsideOtherServiceModule,
        ContractsAsideOtherProductModule,
        NumberModule
    ],
    exports: [ContractsAsideComponent]



})
export class ContractsAsideModule { }
