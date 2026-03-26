import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsPreviewComponent } from './contracts-preview.component';
import { ContractsAsideHourlyBillingPreviewComponent } from './contracts-aside-hourly-billing-preview/contracts-aside-hourly-billing-preview.component';
import { ContractsAsideUserDeviceBillingPreviewComponent } from './contracts-aside-user-device-billing-preview/contracts-aside-user-device-billing-preview.component';
import { ContractsAsideProductServicePreviewComponent } from './contracts-aside-product-service-preview/contracts-aside-product-service-preview.component';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { ContractsAsideBlockTimeBillingPreviewComponent } from './contracts-aside-block-time-billing-preview/contracts-aside-block-time-billing-preview.component';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { TicketsTableItemRequestedByModule } from 'src/app/components/tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';
import { UserLogoPopoverModule } from 'src/app/directives/user-logo-popover/user-logo-popover.module';



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
        DatePickerModule,
        FormsModule,
        NgbModule,
        DropDownModule,
        MatChipModule,
        MatChipListModule,
        TicketsTableItemRequestedByModule,
        UserLogoPopoverModule
    ],
    exports: [ContractsPreviewComponent]


})
export class ContractsPreviewModule { }
