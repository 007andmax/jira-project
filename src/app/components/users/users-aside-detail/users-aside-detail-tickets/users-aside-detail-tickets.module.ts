import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersAsideDetailTicketsComponent } from './users-aside-detail-tickets.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersAsideDetailTicketsItemModule } from './users-aside-detail-tickets-item/users-aside-detail-tickets.module';

@NgModule({
    declarations: [UsersAsideDetailTicketsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        InfiniteScrollModule,
        UsersAsideDetailTicketsItemModule
    ],
    exports: [UsersAsideDetailTicketsComponent]

})
export class UsersAsideDetailTicketsModule { }
