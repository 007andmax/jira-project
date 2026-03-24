import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTableComponent } from './users-table.component';
import { FormsModule } from '@angular/forms';
import { PhoneModule } from 'src/app/pipe/phone/phone.module';
import { NgxMaskModule } from 'ngx-mask';
import { PreparePhoneModule } from 'src/app/pipe/prepare-phone/prepare-phone.module';
import { UserTableSubscriptionComponent } from './user-table-subscription/user-table-subscription.component';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserTableDefaultSubscriptionComponent } from './user-table-default-subscription/user-table-default-subscription.component';
import { UserTableCustomSubscriptionComponent } from './user-table-custom-subscription/user-table-custom-subscription.component';
import { PreviewPhoneMaskModule } from '../../shared/preview-phone-mask/preview-phone-mask.module';
import { UserTableDefaultSubscriptionModule } from './user-table-default-subscription/user-table-default-subscription.module';
import { UserTableCustomSubscriptionModule } from './user-table-custom-subscription/user-table-custom-subscription.module';
import { TicketsTableItemRequestedByModule } from '../../tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';
import { UsersTableCompanyInfoItemComponent } from './users-table-company-info-item/users-table-company-info-item.component';
import { UsersTableCompanyInfoSingleComponent } from './users-table-company-info-single/users-table-company-info-single.component';




@NgModule({
    declarations: [
        UsersTableComponent,
        UserTableSubscriptionComponent,
        UsersTableCompanyInfoItemComponent,
        UsersTableCompanyInfoSingleComponent
    ],
    imports: [
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
        TicketsTableItemRequestedByModule
    ],
    exports: [UsersTableComponent]
})
export class UsersTableModule { }
