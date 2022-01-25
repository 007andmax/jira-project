import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUserToSubscribeComponent } from './add-user-to-subscribe.component';
import { ClickOtsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { AddMarketingSubscriptionTypeModule } from '../../setting/marketing-email/marketing-subscription-type/add-marketing-subscription-type/add-marketing-subscription-type.module';
import { MatFormFieldModule } from '@angular/material';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';


@NgModule({
    declarations: [AddUserToSubscribeComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        ClickOtsideModule,
        AddMarketingSubscriptionTypeModule,
        MatFormFieldModule,
        DisabledBtnModule,
        PreloaderTicketModule

    ],
    entryComponents: [AddUserToSubscribeComponent],
    exports: [AddUserToSubscribeComponent]


})
export class AddUserToSubscribeModule { }
