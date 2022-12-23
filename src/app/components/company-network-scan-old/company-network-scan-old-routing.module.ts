import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyNetworkScanOldComponent } from './company-network-scan-old.component';



const routes: Routes = [{ path: '', component: CompanyNetworkScanOldComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyNetworkScanOldRoutingModule { }