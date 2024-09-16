import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingEmailComponent } from './marketing-email.component';
import { MarketingEmailRoutingModule } from './marketing-email.routing.module';
import { AddMarketingSubscriptionTypeModule } from './marketing-subscription-type/add-marketing-subscription-type/add-marketing-subscription-type.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarketingEmailUsersComponent } from './marketing-email-users/marketing-email-users.component';
import { MarketingSubscriptionTypeComponent } from './marketing-subscription-type/marketing-subscription-type.component';
import { ClickOutsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { FormsModule } from '@angular/forms';
import { MarketingEmailUsersAddComponent } from './marketing-email-users/marketing-email-users-add/marketing-email-users-add.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MarketingEmailUsersAddItemComponent } from './marketing-email-users/marketing-email-users-add-item/marketing-email-users-add-item.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { MarketingEmailUsersItemComponent } from './marketing-email-users/marketing-email-users-item/marketing-email-users-item.component';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';


@NgModule({
    declarations: [MarketingEmailComponent,
        MarketingSubscriptionTypeComponent,
        MarketingEmailUsersComponent,
        MarketingEmailUsersAddComponent,
        MarketingEmailUsersAddItemComponent,
        MarketingEmailUsersItemComponent
    ],
    imports: [
        CommonModule,
        MarketingEmailRoutingModule,
        AddMarketingSubscriptionTypeModule,
        NgbModule,
        ClickOutsideModule,
        FormsModule,
        InfiniteScrollModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        DynamicTooltipModule,
        KeyUpEnterModule,
        MatErrorModule

    ],
})
export class MarketingEmailModule { }
