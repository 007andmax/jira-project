import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { MarketingSubscriptionsAsideComponent } from './marketing-subscriptions-aside.component';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { MarketingSubscriptionsAsideItemInfoComponent } from './marketing-subscriptions-aside-item-info/marketing-subscriptions-aside-item-info.component';
import { MarketingSubscriptionsAsideItemEditComponent } from './marketing-subscriptions-aside-item-edit/marketing-subscriptions-aside-item-edit.component';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';


@NgModule({
    declarations: [MarketingSubscriptionsAsideComponent, MarketingSubscriptionsAsideItemInfoComponent, MarketingSubscriptionsAsideItemEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        KeyUpEnterModule
    ],
    exports: [MarketingSubscriptionsAsideComponent]
})
export class MarketingSubscriptionsAsideModule { }
