import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommissionComponent } from './commission.component';
import { CompanyComponent } from './company/company.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductComponent } from './product/product.component';
import { ContractComponent } from './contract/contract.component';
import { ServiceComponent } from './service/service.component';
import { CommissionRoutingModule } from './commission-routing.module';

import { CompanyTechUsersComponent } from './company/company-tech-users/company-tech-users.component';



@NgModule({
    imports: [
    CommonModule,
    NgbModule,
    CommissionRoutingModule,
    CommissionComponent,
    CompanyComponent,
    ProductComponent,
    ContractComponent,
    ServiceComponent,
    CompanyTechUsersComponent
],
})
export class CommissionModule { }
