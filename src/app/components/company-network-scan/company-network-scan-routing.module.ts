import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyNetworkScanComponent } from './company-network-scan.component';




const routes: Routes = [{ path: '', component: CompanyNetworkScanComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyNetworkScanRoutingModule { }