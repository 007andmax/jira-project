import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionSuperAdminService } from 'src/app/services/users/permission-super-admin.service';
import { SupportPageCategoryComponent } from './support-page-category/support-page-category.component';
import { SupportPageComponent } from './support-page.component';






const routes: Routes = [{
    path: '', component: SupportPageComponent,
    children: [{
        path: ':id',
        component: SupportPageCategoryComponent,
        canActivate: [PermissionSuperAdminService]
    },],
    canActivate: [PermissionSuperAdminService]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SupportPageRoutingModule { }