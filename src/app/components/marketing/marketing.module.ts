import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingRoutingModule } from './marketing-routing.module';
import { MarketingComponent } from './marketing.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersTableModule } from '../users/users-table/users-table.module';
import { FormsModule } from '@angular/forms';

import { MarketingSubscriptionsAsideComponent } from './marketing-subscriptions-aside/marketing-subscriptions-aside.component';



@NgModule({
    imports: [
    CommonModule,
    MarketingRoutingModule,
    InfiniteScrollModule,
    UsersTableModule,
    FormsModule,
    MarketingComponent,
],
})
export class MarketingModule { }
