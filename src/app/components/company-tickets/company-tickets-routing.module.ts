import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyTicketsComponent } from './company-tickets.component';



const routes: Routes = [{ path: '', component: CompanyTicketsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyTicketsRoutingModule { }