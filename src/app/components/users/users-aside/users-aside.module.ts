import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersAsideComponent } from './users-aside.component';
import { FormsModule } from '@angular/forms';
import { MatChipsModule, MatSelectModule } from '@angular/material';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { CompanySubscriptionModule } from '../../companies/company-subscription/company-subscription.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { UserDefaultSubscriptionComponent } from './user-default-subscription/user-default-subscription.component';
import { UserCustomSubscriptionComponent } from './user-custom-subscription/user-custom-subscription.component';
import { UserDefaultSubscriptionModule } from './user-default-subscription/user-default-subscription.module';
import { UserCustomSubscriptionModule } from './user-custom-subscription/user-custom-subscription.module';

@NgModule({
    declarations: [UsersAsideComponent,

    ],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
        DropDownModule,
        CompanySubscriptionModule,
        CompanyTagsModule,
        DisabledBtnModule,
        TextAreaModule,
        UserDefaultSubscriptionModule,
        UserCustomSubscriptionModule
    ],
    exports: [UsersAsideComponent]


})
export class UsersAsideModule { }
