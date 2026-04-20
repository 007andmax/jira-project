import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';

import { CompanyNetworkScanRoutingModule } from './company-network-scan-routing.module';
import { CompanyNetworkScanComponent } from './company-network-scan.component';





@NgModule({
    imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    CompanyNetworkScanRoutingModule,
    CompanyNetworkScanComponent
],
})
export class CompanyNetworkScanModule { }
