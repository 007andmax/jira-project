import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersAsideEditComponent } from './users-aside-edit.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { CompanySubscriptionModule } from '../../companies/company-subscription/company-subscription.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { UserDefaultSubscriptionModule } from '../users-aside/user-default-subscription/user-default-subscription.module';
import { UserCustomSubscriptionModule } from '../users-aside/user-custom-subscription/user-custom-subscription.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';

@NgModule({
    declarations: [UsersAsideEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        DropDownModule,
        CompanySubscriptionModule,
        CompanyTagsModule,
        TextAreaModule,
        UserDefaultSubscriptionModule,
        UserCustomSubscriptionModule,
        NgbModule,
        NgxMaskModule.forRoot(),
        CompanyDropDownModule,
        PreloaderTicketModule,
        DisabledBtnModule
    ],
    exports: [UsersAsideEditComponent]

})
export class UsersAsideEditModule { }
