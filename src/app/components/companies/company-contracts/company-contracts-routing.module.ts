import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyContractsComponent } from './company-contracts.component';





const routes: Routes = [{ path: '', component: CompanyContractsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyContractsRoutingModule { }