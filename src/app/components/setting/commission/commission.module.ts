import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommissionComponent } from './commission.component';
import { CompanyComponent } from './company/company.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductComponent } from './product/product.component';
import { ContractComponent } from './contract/contract.component';
import { ServiceComponent } from './service/service.component';
import { TehUsersModule } from '../../shared/teh-users/teh-users.module';
import { CommissionRoutingModule } from './commission-routing.module';


@NgModule({
    declarations: [CommissionComponent,
        CompanyComponent,
        ProductComponent,
        ContractComponent,
        ServiceComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        TehUsersModule,
        CommissionRoutingModule
    ],



})
export class CommissionModule { }
