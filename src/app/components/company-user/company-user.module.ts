import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyUserComponent } from './company-user.component';
import { UsersHeaderModule } from '../users/users-header/users-header.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersTableModule } from '../users/users-table/users-table.module';
import { CompanyUserRoutingModule } from './company-user-routing.module';



@NgModule({
    declarations: [
        CompanyUserComponent
    ],
    imports: [
        CommonModule,
        UsersHeaderModule,
        InfiniteScrollModule,
        UsersTableModule,
        CompanyUserRoutingModule

    ],



})
export class CompanyUserModule { }
