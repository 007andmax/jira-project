import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperAdminPublicCategoryComponent } from './super-admin-public-category.component';


const routes: Routes = [{
    path: '', component: SuperAdminPublicCategoryComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SuperAdminPublicCategoryRoutingModule { }