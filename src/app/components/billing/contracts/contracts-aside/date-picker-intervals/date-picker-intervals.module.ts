import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { DatePickerIntervalsComponent } from './date-picker-intervals.component';

@NgModule({
    declarations: [
        DatePickerIntervalsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule
    ],
    exports: [DatePickerIntervalsComponent],


})
export class DatePickerIntervalsModule { }
