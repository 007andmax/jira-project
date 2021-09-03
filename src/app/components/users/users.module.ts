import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { UsersComponent } from './users.component';
import { UsersHeaderModule } from './users-header/users-header.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersTableModule } from './users-table/users-table.module';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
    declarations: [UsersComponent
    ],
    imports: [
        CommonModule,
        UsersHeaderModule,
        InfiniteScrollModule,
        UsersTableModule,
        UsersRoutingModule

    ],



})
export class UsersModule { }
