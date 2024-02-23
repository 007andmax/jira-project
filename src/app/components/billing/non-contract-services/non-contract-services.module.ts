import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonContractServicesComponent } from './non-contract-services.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NonContractServicesItemComponent } from './non-contract-services-item/non-contract-services-item.component';
import { NonContractServicesContractsComponent } from './non-contract-services-contracts/non-contract-services-contracts.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { FormsModule } from '@angular/forms';
import { NonContractServicesRoutingModule } from './non-contract-services-routing.module';




@NgModule({
    declarations: [NonContractServicesComponent,
        NonContractServicesItemComponent,
        NonContractServicesContractsComponent

    ],
    imports: [
        CommonModule,
        NgbModule,
        DropDownModule,
        FormsModule,
        NonContractServicesRoutingModule
    ],



})
export class NonContractServicesModule { }
