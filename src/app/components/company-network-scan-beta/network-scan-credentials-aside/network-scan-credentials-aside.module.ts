import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NetworkScanCredentialsAsideComponent } from './network-scan-credentials-aside.component';
import { NetworkScanCredentialsAddComponent } from '../network-scan-credentials-add/network-scan-credentials-add.component';
import { NetworkScanCredentialsAsideItemComponent } from './network-scan-credentials-aside-item/network-scan-credentials-aside-item.component';

@NgModule({
    declarations: [
        NetworkScanCredentialsAsideComponent,
        NetworkScanCredentialsAddComponent,
        NetworkScanCredentialsAsideItemComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    exports: [NetworkScanCredentialsAsideComponent]
})
export class NetworkScanCredentialsAsideModule { }
