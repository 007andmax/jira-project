import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyNetworkScanNoExistDevicesComponent } from './company-network-scan-no-exist-devices.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        CompanyNetworkScanNoExistDevicesComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    exports: [CompanyNetworkScanNoExistDevicesComponent]
})
export class CompanyNetworkScanNoExistDevicesModule { }
