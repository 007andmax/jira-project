import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultServicesComponent } from './default-services.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DefaultServicesItemComponent } from './default-services-item/default-services-item.component';
import { DefaultServicesContractsComponent } from './default-services-contracts/default-services-contracts.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { FormsModule } from '@angular/forms';
import { DefaultServicesRoutingModule } from './default-services-routing.module';




@NgModule({
    declarations: [DefaultServicesComponent,
        DefaultServicesItemComponent,
        DefaultServicesContractsComponent

    ],
    imports: [
        CommonModule,
        NgbModule,
        DropDownModule,
        FormsModule,
        DefaultServicesRoutingModule
    ],



})
export class DefaultServicesModule { }
