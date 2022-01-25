import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingEmailComponent } from './marketing-email.component';
import { MarketingEmailRoutingModule } from './marketing-email.routing.module';
import { AddMarketingSubscriptionTypeModule } from './marketing-subscription-type/add-marketing-subscription-type/add-marketing-subscription-type.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarketingEmailUsersComponent } from './marketing-email-users/marketing-email-users.component';
import { MarketingSubscriptionTypeComponent } from './marketing-subscription-type/marketing-subscription-type.component';
import { ClickOtsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { MarketingEmailUsersAddComponent } from './marketing-email-users/marketing-email-users-add/marketing-email-users-add.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MarketingEmailUsersItemComponent } from './marketing-email-users/marketing-email-users-item/marketing-email-users-item.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';


@NgModule({
    declarations: [MarketingEmailComponent,
        MarketingSubscriptionTypeComponent,
        MarketingEmailUsersComponent,
        MarketingEmailUsersAddComponent,
        MarketingEmailUsersItemComponent
    ],
    imports: [
        CommonModule,
        MarketingEmailRoutingModule,
        AddMarketingSubscriptionTypeModule,
        NgbModule,
        ClickOtsideModule,
        FormsModule,
        MatFormFieldModule,
        InfiniteScrollModule,
        DisabledBtnModule,
        PreloaderTicketModule

    ],
})
export class MarketingEmailModule { }
