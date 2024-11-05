import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompaniesUsersDetailsComponent } from './companies-users-details.component';

const routes: Routes = [{ path: '', component: CompaniesUsersDetailsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompaniesUsersDetailsRoutingModule { }