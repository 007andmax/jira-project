import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsPreviewComponent } from './contracts-preview.component';
import { ContractsAsideHourlyBillingPreviewComponent } from './contracts-aside-hourly-billing-preview/contracts-aside-hourly-billing-preview.component';
import { ContractsAsideBlockTimeBillingPreviewComponent } from './contracts-aside-block-time-billing-preview/contracts-aside-block-time-billing-preview.component';
import { ContractsAsideUserDeviceBillingPreviewComponent } from './contracts-aside-user-device-billing-preview/contracts-aside-user-device-billing-preview.component';
import { ContractsAsideProductServicePreviewComponent } from './contracts-aside-product-service-preview/contracts-aside-product-service-preview.component';
import { SelectSearchModule } from 'src/app/components/shared/select-search/select-search.module';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatChipsModule, MatSelectModule } from '@angular/material';



@NgModule({
    declarations: [
        ContractsPreviewComponent,
        ContractsAsideHourlyBillingPreviewComponent,
        ContractsAsideBlockTimeBillingPreviewComponent,
        ContractsAsideUserDeviceBillingPreviewComponent,
        ContractsAsideProductServicePreviewComponent
    ],
    imports: [
        CommonModule,
        SelectSearchModule,
        DatePickerModule,
        FormsModule,
        NgbModule,
        DropDownModule,
        MatSelectModule,
        MatChipsModule,
    ],
    exports: [ContractsPreviewComponent]


})
export class ContractsPreviewModule { }
