import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesComponent } from './devices.component';
import { DevicesRoutingModule } from './devices-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownModule } from '../shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from '../shared/dynamic-tooltip/dynamic-tooltip.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerModule } from '../shared/date-picker/date-picker.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { ReportSendEmailModule } from '../reports/report-additional-actions/report-send-email/report-send-email.module';
import { MatChipListModule } from '../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../shared/mat-chip/mat-chip.module';
import { MatOptionModule } from '../shared/mat-option/mat-option.module';
import { MatFormFieldModule } from '../shared/mat-form-field/mat-form-field.module';

@NgModule({
    declarations: [
        DevicesComponent
    ],
    imports: [
        CommonModule,
        DevicesRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        DropDownModule,
        DynamicTooltipModule,
        NgbModule,
        DatePickerModule,
        DisabledBtnModule,
        ReportSendEmailModule,
        MatChipModule,
        MatChipListModule,
        MatOptionModule,
        MatFormFieldModule
    ],
})
export class DevicesModule { }
