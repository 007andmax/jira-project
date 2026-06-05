import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDeviceBetaRoutingModule } from './company-device-beta-routing.module';
import { CompanyDeviceBetaComponent } from './company-device-beta.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeviceBeta } from 'src/app/pipe/device-beta.pipe';
import { DatePickerComponent } from '../shared/date-picker/date-picker.component';
import { DropDownComponent } from '../shared/drop-down/drop-down.component';


@NgModule({
    declarations: [
        CompanyDeviceBetaComponent,
        DeviceBeta,
        DropDownComponent,
        DatePickerComponent
    ],
    imports: [
        CommonModule,
        CompanyDeviceBetaRoutingModule,
        DropDownModule,
        DatePickerModule,
        ReactiveFormsModule,
        FormsModule,
        DynamicTooltipModule,
        NgbModule,
        DisabledBtnModule,
        ReportSendEmailModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatOptionModule,
        DatePickerComponent
    ],
})
export class CompanyDeviceBetaModule { }
