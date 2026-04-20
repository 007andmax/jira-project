import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { UsersComponent } from './users.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersTableModule } from './users-table/users-table.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersCheckUseComponent } from './users-check-use/users-check-use.component';
import { AddUserToCompanyComponent } from './add-user-to-company/add-user-to-company.component';
import { AddUserToCompanyItemComponent } from './add-user-to-company/add-user-to-company-item/add-user-to-company-item.component';

import { FormsModule } from '@angular/forms';
import { UserFilterSaveComponent } from './user-filter-save/user-filter-save.component';
import { UserDeArchiveNotificationComponent } from './user-de-archive-notification/user-de-archive-notification.component';

@NgModule({
    imports: [
    CommonModule,
    InfiniteScrollModule,
    UsersTableModule,
    UsersRoutingModule,
    FormsModule,
    UsersComponent
],
})
export class UsersModule { }
