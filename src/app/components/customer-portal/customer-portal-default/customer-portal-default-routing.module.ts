import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPortalDefaultComponent } from './customer-portal-default.component';


const routes: Routes = [{ path: '', component: CustomerPortalDefaultComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerPortalDefaultRoutingModule { }