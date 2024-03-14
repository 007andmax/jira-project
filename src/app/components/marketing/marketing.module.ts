import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingRoutingModule } from './marketing-routing.module';
import { MarketingComponent } from './marketing.component';
import { UsersHeaderModule } from '../users/users-header/users-header.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersTableModule } from '../users/users-table/users-table.module';
import { FormsModule } from '@angular/forms';
import { UsersFilterModule } from '../users/users-header/users-filter/users-filter.module';
import { MarketingSubscriptionsAsideComponent } from './marketing-subscriptions-aside/marketing-subscriptions-aside.component';
import { MarketingSubscriptionsAsideModule } from './marketing-subscriptions-aside/marketing-subscriptions-aside.module';


@NgModule({
    declarations: [MarketingComponent
    ],
    imports: [
        CommonModule,
        MarketingRoutingModule,
        UsersHeaderModule,
        InfiniteScrollModule,
        UsersTableModule,
        FormsModule,
        UsersFilterModule,
        MarketingSubscriptionsAsideModule

    ],
})
export class MarketingModule { }
