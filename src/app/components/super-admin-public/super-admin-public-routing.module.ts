import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperAdminPublicComponent } from './super-admin-public.component';


const routes: Routes = [{
    path: '', component: SuperAdminPublicComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SupperAdminPublicRoutingModule { }