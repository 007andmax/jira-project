import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company/company.component';
import { ContractComponent } from './contract/contract.component';
import { ProductComponent } from './product/product.component';
import { ServiceComponent } from './service/service.component';
import { SharedModule } from 'src/ng2/app/shared/shared.module';

@NgModule({
  declarations: [
    CompanyComponent,
    ContractComponent,
    ProductComponent,
    ServiceComponent
  ],
  imports: [
  SharedModule  
  ],
  
})
export class CommissionModule {}
