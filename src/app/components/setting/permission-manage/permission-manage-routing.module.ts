import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionManageComponent } from './permission-manage.component';




const routes: Routes = [{ path: '', component: PermissionManageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PermissionManageRoutingModule { }