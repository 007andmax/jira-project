import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingEmailComponent } from './marketing-email.component';
import { MarketingEmailRoutingModule } from './marketing-email.routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarketingEmailUsersComponent } from './marketing-email-users/marketing-email-users.component';
import { MarketingSubscriptionTypeComponent } from './marketing-subscription-type/marketing-subscription-type.component';

import { FormsModule } from '@angular/forms';
import { MarketingEmailUsersAddComponent } from './marketing-email-users/marketing-email-users-add/marketing-email-users-add.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MarketingEmailUsersAddItemComponent } from './marketing-email-users/marketing-email-users-add-item/marketing-email-users-add-item.component';




import { MarketingEmailUsersItemComponent } from './marketing-email-users/marketing-email-users-item/marketing-email-users-item.component';



@NgModule({
    imports: [
    CommonModule,
    MarketingEmailRoutingModule,
    NgbModule,
    FormsModule,
    InfiniteScrollModule,
    MarketingEmailComponent,
    MarketingSubscriptionTypeComponent,
    MarketingEmailUsersComponent,
    MarketingEmailUsersAddComponent,
    MarketingEmailUsersAddItemComponent,
    MarketingEmailUsersItemComponent
],
})
export class MarketingEmailModule { }
