import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersDetailsTabTicketsItemComponent } from './users-details-tab-tickets-item/users-details-tab-tickets-item.component';
import { UsersDetailsTabTicketsComponent } from './users-details-tab-tickets.component';
import { UserTableCustomSubscriptionModule } from '../../users/users-table/user-table-custom-subscription/user-table-custom-subscription.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';


@NgModule({
  declarations: [UsersDetailsTabTicketsComponent,
    UsersDetailsTabTicketsItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InfiniteScrollModule,
    UserTableCustomSubscriptionModule,
    DropDownModule,
  ],
  exports: [UsersDetailsTabTicketsComponent]
})
export class UsersDetailsTabTicketsModule { }
