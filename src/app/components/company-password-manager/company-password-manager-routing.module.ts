import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyPasswordManagerComponent } from './company-password-manager.component';



const routes: Routes = [{ path: '', component: CompanyPasswordManagerComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyPasswordManagerRoutingModule { }