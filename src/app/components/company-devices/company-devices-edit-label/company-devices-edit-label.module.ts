import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDevicesEditLabelComponent } from './company-devices-edit-label.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        CompanyDevicesEditLabelComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
    ],
    exports: [CompanyDevicesEditLabelComponent]



})
export class CompanyDevicesEditLabelModule { }
