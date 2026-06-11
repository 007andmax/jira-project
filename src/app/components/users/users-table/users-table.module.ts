import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTableComponent } from './users-table.component';
import { FormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';

import { UserTableSubscriptionComponent } from './user-table-subscription/user-table-subscription.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserTableDefaultSubscriptionComponent } from './user-table-default-subscription/user-table-default-subscription.component';
import { UserTableCustomSubscriptionComponent } from './user-table-custom-subscription/user-table-custom-subscription.component';
import { PreviewPhoneMaskModule } from '../../shared/preview-phone-mask/preview-phone-mask.module';


import { UserTableDefaultSubscriptionModule } from './user-table-default-subscription/user-table-default-subscription.module';
import { UserTableCustomSubscriptionModule } from './user-table-custom-subscription/user-table-custom-subscription.module';
import { TicketsTableItemRequestedByModule } from '../../tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';
import { UsersTableCompanyInfoItemComponent } from './users-table-company-info-item/users-table-company-info-item.component';
import { UsersTableCompanyInfoSingleComponent } from './users-table-company-info-single/users-table-company-info-single.component';
import { UserLogoPopoverModule } from 'src/app/directives/user-logo-popover/user-logo-popover.module';
import { UsersTableCompanyByComponent } from './users-table-company-by/users-table-company-by.component';
import { CompanyLogoPopoverModule } from 'src/app/directives/company-logo-popover/company-logo-popover.module';
import { UsersTableCompanyByModule } from './users-table-company-by/users-table-company-by.module';




@NgModule({
    declarations: [
        UsersTableComponent,
        UserTableSubscriptionComponent,
        UsersTableCompanyInfoItemComponent,
        UsersTableCompanyInfoSingleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxMaskModule.forRoot(),
        NgbModule,
        PreviewPhoneMaskModule,
        CommonModule,
        FormsModule,
        PhoneModule,
        NgxMaskModule.forRoot(),
        PreparePhoneModule,
        DynamicTooltipModule,
        NgbModule,
        PreviewPhoneMaskModule,
        UserTableDefaultSubscriptionModule,
        UserTableCustomSubscriptionModule,
        TicketsTableItemRequestedByModule,
        UserLogoPopoverModule,
        CompanyLogoPopoverModule,
        UsersTableCompanyByModule
    ],
    exports: [UsersTableComponent]
})
export class UsersTableModule { }
