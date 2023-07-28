import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPermissionsComponent } from './customer-permissions.component';

const routes: Routes = [{ path: '', component: CustomerPermissionsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerPermissionsRoutingModule { }