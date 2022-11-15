import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyDashboardComponent } from './company-dashboard.component';




const routes: Routes = [{ path: '', component: CompanyDashboardComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyDashboardRoutingModule { }