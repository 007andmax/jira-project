import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyUserComponent } from './company-user.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersTableModule } from '../users/users-table/users-table.module';
import { CompanyUserRoutingModule } from './company-user-routing.module';

import { FormsModule } from '@angular/forms';



@NgModule({
    imports: [
    FormsModule,
    CommonModule,
    InfiniteScrollModule,
    UsersTableModule,
    CompanyUserRoutingModule,
    CompanyUserComponent
],
})
export class CompanyUserModule { }
