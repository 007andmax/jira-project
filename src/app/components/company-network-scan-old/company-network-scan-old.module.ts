import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { FormsModule } from '@angular/forms';
import { CompanyDevicesEditLabelModule } from '../company-devices/company-devices-edit-label/company-devices-edit-label.module';
import { CompanyNetworkScanOldRoutingModule } from './company-network-scan-old-routing.module';
import { CompanyNetworkScanOldComponent } from './company-network-scan-old.component';
import { CompanyNetworkScanNoExistDevicesModule } from '../company-network-scan/company-network-scan-no-exist-devices/company-network-scan-no-exist-devices.module';
import { CompanyNetworkScanItemModule } from '../company-network-scan/company-network-scan-item/company-network-scan-item.module';
import { NetworkScanCredentialsAsideModule } from '../company-network-scan/network-scan-credentials-aside/network-scan-credentials-aside.module';


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
        CompanyNetworkScanOldRoutingModule,
        CompanyNetworkScanNoExistDevicesModule,
        CompanyNetworkScanItemModule,
        NetworkScanCredentialsAsideModule
    ],
})
export class CompanyNetworkScanOldModule { }
