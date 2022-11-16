import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDeviceBetaRoutingModule } from './company-device-beta-routing.module';
import { CompanyDeviceBetaComponent } from './company-device-beta.component';
import { DropDownModule } from '../shared/drop-down/drop-down.module';

@NgModule({
    declarations: [
        CompanyDeviceBetaComponent
    ],
    imports: [
        CommonModule,
        CompanyDeviceBetaRoutingModule,
        DropDownModule
    ],
})
export class CompanyDeviceBetaModule { }
