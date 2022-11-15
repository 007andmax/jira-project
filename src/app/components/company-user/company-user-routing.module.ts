import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyUserComponent } from './company-user.component';





const routes: Routes = [{ path: '', component: CompanyUserComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyUserRoutingModule { }