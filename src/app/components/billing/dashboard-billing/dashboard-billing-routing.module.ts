import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardBillingComponent } from './dashboard-billing.component';



const routes: Routes = [{ path: '', component: DashboardBillingComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardBillingRoutingModule { }