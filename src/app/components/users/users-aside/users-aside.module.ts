import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersAsideComponent } from './users-aside.component';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { CompanySubscriptionModule } from '../../companies/company-subscription/company-subscription.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { UserDefaultSubscriptionComponent } from './user-default-subscription/user-default-subscription.component';
import { UserCustomSubscriptionComponent } from './user-custom-subscription/user-custom-subscription.component';
import { UserDefaultSubscriptionModule } from './user-default-subscription/user-default-subscription.module';
import { UserCustomSubscriptionModule } from './user-custom-subscription/user-custom-subscription.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';

@NgModule({
    declarations: [UsersAsideComponent,

    ],
    imports: [
        CommonModule,
        FormsModule,
        DropDownModule,
        CompanySubscriptionModule,
        CompanyTagsModule,
        DisabledBtnModule,
        TextAreaModule,
        UserDefaultSubscriptionModule,
        UserCustomSubscriptionModule,
        NgbModule,
        NgxMaskModule.forRoot(),
        CompanyDropDownModule,
        PreloaderTicketModule,
        DynamicTooltipModule,
        MatErrorModule
    ],
    exports: [UsersAsideComponent]


})
export class UsersAsideModule { }
