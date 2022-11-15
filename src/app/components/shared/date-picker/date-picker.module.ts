import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { DatePickerComponent } from './date-picker.component';
import { DynamicTooltipModule } from '../dynamic-tooltip/dynamic-tooltip.module';
@NgModule({
    declarations: [
        DatePickerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule
    ],
    exports: [DatePickerComponent],


})
export class DatePickerModule { }
