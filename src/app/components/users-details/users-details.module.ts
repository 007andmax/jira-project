import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersDetailsHeaderComponent } from './users-details-header/users-details-header.component';
import { UsersDetailsLeftPanelComponent } from './users-details-left-panel/users-details-left-panel.component';
import { UsersDetailsRoutingModule } from './users-details-routing.module';
import { UsersDetailsComponent } from './users-details.component';
import { DynamicTooltipModule } from '../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatErrorModule } from '../shared/mat-error/mat-error.module';
import { NgxMaskModule } from 'ngx-mask';
import { UserCustomSubscriptionModule } from '../users/users-aside/user-custom-subscription/user-custom-subscription.module';
import { CompanyTagsModule } from '../companies/company-tags/company-tags.module';
import { UsersDetailsTabCompaniesComponent } from './users-details-tab-companies/users-details-tab-companies.component';
import { UsersDetailsTabCompaniesItemComponent } from './users-details-tab-companies/users-details-tab-companies-item/users-details-tab-companies-item.component';
import { DropDownModule } from '../shared/drop-down/drop-down.module';
import { UserTableDefaultSubscriptionModule } from '../users/users-table/user-table-default-subscription/user-table-default-subscription.module';
import { PreviewPhoneMaskModule } from '../shared/preview-phone-mask/preview-phone-mask.module';
import { UserTableCustomSubscriptionModule } from '../users/users-table/user-table-custom-subscription/user-table-custom-subscription.module';
import { UsersDetailsTabCompaniesAddComponent } from './users-details-tab-companies/users-details-tab-companies-add/users-details-tab-companies-add.component';
import { CompanyDropDownModule } from '../shared/company-drop-down/company-drop-down.module';
import { ClickOutsideModule } from 'src/app/directives/click-otside/click-otside.module';


@NgModule({
    declarations: [UsersDetailsComponent,
        UsersDetailsHeaderComponent,
        UsersDetailsLeftPanelComponent,
        UsersDetailsTabCompaniesComponent,
        UsersDetailsTabCompaniesItemComponent,
        UsersDetailsTabCompaniesAddComponent,
    ],
    imports: [
        CommonModule,
        UsersDetailsRoutingModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule,
        NgxMaskModule.forRoot(),
        MatErrorModule,
        UserCustomSubscriptionModule,
        CompanyTagsModule,
        ReactiveFormsModule,
        DropDownModule,
        UserTableDefaultSubscriptionModule,
        PreviewPhoneMaskModule,
        UserTableCustomSubscriptionModule,
        CompanyDropDownModule,
        ClickOutsideModule
    ],
})
export class UsersDetailsModule { }
