import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CompanyNetworkScanItemComponent } from './company-network-scan-item.component';
import { CompanyDevicesEditLabelModule } from '../../company-devices/company-devices-edit-label/company-devices-edit-label.module';
import { CompanyNetworkScanItemTooltipComponent } from './company-network-scan-item-tooltip/company-network-scan-item-tooltip.component';

@NgModule({
    declarations: [
        CompanyNetworkScanItemComponent,
        CompanyNetworkScanItemTooltipComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        CompanyDevicesEditLabelModule
    ],
    exports: [CompanyNetworkScanItemComponent]
})
export class CompanyNetworkScanItemModule { }
