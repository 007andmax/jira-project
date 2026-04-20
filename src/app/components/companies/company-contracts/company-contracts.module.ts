import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyContractsComponent } from './company-contracts.component';





import { CompanyContractsRoutingModule } from './company-contracts-routing.module';



@NgModule({
    imports: [
    CommonModule,
    CompanyContractsRoutingModule,
    CompanyContractsComponent
],
})
export class CompanyContractsModule { }
