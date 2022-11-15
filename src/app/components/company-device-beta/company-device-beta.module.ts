import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDeviceBetaRoutingModule } from './company-device-beta-routing.module';
import { CompanyDeviceBetaComponent } from './company-device-beta.component';

@NgModule({
    declarations: [
        CompanyDeviceBetaComponent
    ],
    imports: [
        CommonModule,
        CompanyDeviceBetaRoutingModule
    ],
})
export class CompanyDeviceBetaModule { }
