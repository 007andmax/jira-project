import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyNetworkScanBetaComponent } from './company-network-scan-beta.component';
import { CompanyNetworkScanNoExistDevicesComponent } from './company-network-scan-no-exist-devices/company-network-scan-no-exist-devices.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { FormsModule } from '@angular/forms';
import { CompanyNetworkScanItemComponent } from './company-network-scan-item/company-network-scan-item.component';
import { NetworkScanCredentialsAsideComponent } from './network-scan-credentials-aside/network-scan-credentials-aside.component';
import { CompanyDevicesEditLabelModule } from '../company-devices/company-devices-edit-label/company-devices-edit-label.module';
import { CompanyNetworkScanItemTooltipComponent } from './company-network-scan-item/company-network-scan-item-tooltip/company-network-scan-item-tooltip.component';
import { NetworkScanCredentialsAddComponent } from './network-scan-credentials-add/network-scan-credentials-add.component';
import { NetworkScanCredentialsAsideItemComponent } from './network-scan-credentials-aside/network-scan-credentials-aside-item/network-scan-credentials-aside-item.component';
import { CompanyNetworkScanBetaRoutingModule } from './company-network-scan-beta-routing.module';
import { CompanyNetworkScanNoExistDevicesModule } from './company-network-scan-no-exist-devices/company-network-scan-no-exist-devices.module';
import { CompanyNetworkScanItemModule } from './company-network-scan-item/company-network-scan-item.module';
import { NetworkScanCredentialsAsideModule } from './network-scan-credentials-aside/network-scan-credentials-aside.module';


@NgModule({
    declarations: [
        CompanyNetworkScanBetaComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        DisabledBtnModule,
        FormsModule,
        CompanyDevicesEditLabelModule,
        CompanyNetworkScanBetaRoutingModule,
        CompanyNetworkScanNoExistDevicesModule,
        CompanyNetworkScanItemModule,
        NetworkScanCredentialsAsideModule
    ],
})
export class CompanyNetworkScanBetaModule { }
