import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingRoutingModule } from './marketing-routing.module';
import { MarketingComponent } from './marketing.component';
import { UsersHeaderModule } from '../users/users-header/users-header.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersTableModule } from '../users/users-table/users-table.module';


@NgModule({
    declarations: [MarketingComponent
    ],
    imports: [
        CommonModule,
        MarketingRoutingModule,
        UsersHeaderModule,
        InfiniteScrollModule,
        UsersTableModule

    ],
})
export class MarketingModule { }
