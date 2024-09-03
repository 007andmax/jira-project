import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDeviceBetaRoutingModule } from './company-device-beta-routing.module';
import { CompanyDeviceBetaComponent } from './company-device-beta.component';
import { DropDownModule } from '../shared/drop-down/drop-down.module';
import { MatAutocompleteModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatSelectModule } from '@angular/material';
import { DatePickerModule } from '../shared/date-picker/date-picker.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceBeta } from 'src/app/pipe/device-beta.pipe';
import { DynamicTooltipModule } from '../shared/dynamic-tooltip/dynamic-tooltip.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { ReportSendEmailModule } from '../reports/report-additional-actions/report-send-email/report-send-email.module';
import { MatChipListModule } from '../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../shared/mat-chip/mat-chip.module';

@NgModule({
    declarations: [
        CompanyDeviceBetaComponent,
        DeviceBeta
    ],
    imports: [
        CommonModule,
        CompanyDeviceBetaRoutingModule,
        DropDownModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        DatePickerModule,
        ReactiveFormsModule,
        FormsModule,
        MatAutocompleteModule,
        DynamicTooltipModule,
        NgbModule,
        DisabledBtnModule,
        ReportSendEmailModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
    ],
})
export class CompanyDeviceBetaModule { }
