import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { FormsModule } from '@angular/forms';
import { CompanyDevicesEditLabelModule } from '../company-devices/company-devices-edit-label/company-devices-edit-label.module';
import { CompanyNetworkScanOldRoutingModule } from './company-network-scan-old-routing.module';
import { CompanyNetworkScanOldComponent } from './company-network-scan-old.component';


@NgModule({
    declarations: [
        CompanyNetworkScanOldComponent

    ],
    imports: [
        CommonModule,
        NgbModule,
        DisabledBtnModule,
        FormsModule,
        CompanyDevicesEditLabelModule,
        CompanyNetworkScanOldRoutingModule
    ],
})
export class CompanyNetworkScanOldModule { }
