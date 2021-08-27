import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsEditComponent } from './contracts-edit.component';
import { ContractsAsideHourlyEditComponent } from './contracts-aside-hourly-edit/contracts-aside-hourly-edit.component';
import { ContractsAsideBlockTimeEditComponent } from './contracts-aside-block-time-edit/contracts-aside-block-time-edit.component';
import { ContractsAsideUserDeviceEditComponent } from './contracts-aside-user-device-edit/contracts-aside-user-device-edit.component';
import { ContractsAsideProductServiceEditComponent } from './contracts-aside-product-service-edit/contracts-aside-product-service-edit.component';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { SelectSearchModule } from 'src/app/components/shared/select-search/select-search.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { ContractsAsideHourlyBillingEditDefaultServiceComponent } from './contracts-aside-hourly-edit/contracts-aside-hourly-billing-edit-default-service/contracts-aside-hourly-billing-edit-default-service.component';
import { ContractsAsideEditHourlyAddDefaultServiceComponent } from './contracts-aside-hourly-edit/contracts-aside-edit-hourly-add-default-service/contracts-aside-edit-hourly-add-default-service.component';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { InvoiceFormTicketEditTaxesModule } from '../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { ContractsAsideBlockTimeEditCustomerServiceComponent } from './contracts-aside-block-time-edit/contracts-aside-block-time-edit-customer-service/contracts-aside-block-time-edit-customer-service.component';
import { ContractsAsideBlockTimeBillingDefaultServiceModule } from '../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-default-service/contracts-aside-block-time-billing-default-service.module';
import { ContractsAsideBlockTimeBillingAddDefaultServiceModule } from '../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-add-default-service/contracts-aside-block-time-billing-add-default-service.module';
import { TehUsersModule } from 'src/app/components/shared/teh-users/teh-users.module';
import { ContractsAsideBlockTimeBillingUsersModule } from '../contracts-aside/contracts-aside-block-time-billing/contracts-aside-block-time-billing-users/contracts-aside-block-time-billing-users.module';
import { ContractsAsideUserDeviceServiceModule } from '../contracts-aside/contracts-aside-user-device-billing/contracts-aside-user-device-service/contracts-aside-user-device-service.module';



@NgModule({
    declarations: [ContractsEditComponent,
        ContractsAsideHourlyEditComponent,
        ContractsAsideBlockTimeEditComponent,
        ContractsAsideUserDeviceEditComponent,
        ContractsAsideProductServiceEditComponent,
        ContractsAsideHourlyBillingEditDefaultServiceComponent,
        ContractsAsideEditHourlyAddDefaultServiceComponent,
        ContractsAsideBlockTimeEditCustomerServiceComponent
    ],
    imports: [
        CommonModule,
        PreloaderTicketModule,
        DisabledBtnModule,
        SelectSearchModule,
        DatePickerModule,
        FormsModule,
        NgbModule,
        MatSelectModule,
        MatChipsModule,
        DropDownModule,
        InvoiceFormTicketEditTaxesModule,
        DecimalNumberModule,
        ContractsAsideBlockTimeBillingDefaultServiceModule,
        ContractsAsideBlockTimeBillingAddDefaultServiceModule,
        TehUsersModule,
        ContractsAsideBlockTimeBillingUsersModule,
        ContractsAsideUserDeviceServiceModule
    ],



})
export class ContractsEditModule { }
