import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyNetworkScanBetaComponent } from './company-network-scan-beta.component';




const routes: Routes = [{ path: '', component: CompanyNetworkScanBetaComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyNetworkScanBetaRoutingModule { }