import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperAdminCompaniesComponent } from './super-admin-companies.component';


const routes: Routes = [{ path: '', component: SuperAdminCompaniesComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SuperAdminCompaniesRoutingModule { }