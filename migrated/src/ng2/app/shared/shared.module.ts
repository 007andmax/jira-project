import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from '../components/setting/commission/company/company.component';
import { ContractComponent } from '../components/setting/commission/contract/contract.component';
import { ProductComponent } from '../components/setting/commission/product/product.component';
import { ServiceComponent } from '../components/setting/commission/service/service.component';

@NgModule({
  declarations: [
    CommonModule,
    CompanyComponent,
    ContractComponent,
    ProductComponent,
    ServiceComponent
  ],
  imports: [
    CommonModule,
    CompanyComponent,
    ContractComponent,
    ProductComponent,
    ServiceComponent
  ]
})
export class SharedModule {}
