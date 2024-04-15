import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDevicesEditLabelComponent } from './company-devices-edit-label.component';
import { FormsModule } from '@angular/forms';
import { ClickOtsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';


@NgModule({
    declarations: [
        CompanyDevicesEditLabelComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ClickOtsideModule,
        KeyUpEnterModule
    ],
    exports: [CompanyDevicesEditLabelComponent]



})
export class CompanyDevicesEditLabelModule { }
