import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminPublicCategoryComponent } from './super-admin-public-category.component';
import { SuperAdminPublicCategoryRoutingModule } from './super-admin-public-category-routing.module';
import { SuperAdminPublicDetailComponent } from '../super-admin-public-detail/super-admin-public-detail.component';



@NgModule({
    imports: [
    CommonModule,
    SuperAdminPublicCategoryRoutingModule,
    SuperAdminPublicCategoryComponent,
    SuperAdminPublicDetailComponent
],
})
export class SuperAdminPublicCategoryModule { }
