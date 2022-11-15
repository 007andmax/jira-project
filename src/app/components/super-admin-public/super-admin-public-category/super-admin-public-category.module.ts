import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminPublicCategoryComponent } from './super-admin-public-category.component';
import { SuperAdminPublicCategoryRoutingModule } from './super-admin-public-category-routing.module';
import { SuperAdminPublicDetailComponent } from '../super-admin-public-detail/super-admin-public-detail.component';
import { SuperAdminPublicHeaderModule } from '../super-admin-public-header/super-admin-public-header.module';


@NgModule({
    declarations: [
        SuperAdminPublicCategoryComponent,
        SuperAdminPublicDetailComponent
    ],
    imports: [
        CommonModule,
        SuperAdminPublicCategoryRoutingModule,
        SuperAdminPublicHeaderModule
    ],

})
export class SuperAdminPublicCategoryModule { }
