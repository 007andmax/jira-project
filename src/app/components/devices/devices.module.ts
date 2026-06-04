import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesComponent } from './devices.component';
import { DevicesRoutingModule } from './devices-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../shared/date-picker/date-picker.component';
import { DropDownComponent } from '../shared/drop-down/drop-down.component';


@NgModule({
    declarations: [
        DevicesComponent,
        DatePickerComponent,
        DropDownComponent
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
        MatFormFieldModule,
    ],
})
export class DevicesModule { }
