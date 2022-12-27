import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { FormsModule } from '@angular/forms';
import { CompanyDevicesEditLabelModule } from '../company-devices/company-devices-edit-label/company-devices-edit-label.module';
import { CompanyNetworkScanRoutingModule } from './company-network-scan-routing.module';
import { CompanyNetworkScanComponent } from './company-network-scan.component';
import { CompanyNetworkScanItemModule } from '../company-network-scan-beta/company-network-scan-item/company-network-scan-item.module';
import { CompanyNetworkScanNoExistDevicesModule } from '../company-network-scan-beta/company-network-scan-no-exist-devices/company-network-scan-no-exist-devices.module';
import { NetworkScanCredentialsAsideModule } from '../company-network-scan-beta/network-scan-credentials-aside/network-scan-credentials-aside.module';


@NgModule({
    declarations: [
        CompanyNetworkScanComponent

    ],
    imports: [
        CommonModule,
        NgbModule,
        DisabledBtnModule,
        FormsModule,
        CompanyDevicesEditLabelModule,
        CompanyNetworkScanRoutingModule,
        CompanyNetworkScanNoExistDevicesModule,
        CompanyNetworkScanItemModule,
        NetworkScanCredentialsAsideModule
    ],
})
export class CompanyNetworkScanModule { }
