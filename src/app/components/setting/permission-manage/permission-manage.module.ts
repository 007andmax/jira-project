import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionManageComponent } from './permission-manage.component';
import { FormsModule } from '@angular/forms';
import { PermissionManageRoutingModule } from './permission-manage-routing.module';




@NgModule({
    declarations: [PermissionManageComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        PermissionManageRoutingModule
    ],



})
export class PermissionManageModule { }
