import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersDetailsTabCompaniesAddComponent } from './users-details-tab-companies-add/users-details-tab-companies-add.component';
import { UsersDetailsTabCompaniesComponent } from './users-details-tab-companies.component';
import { UsersDetailsTabCompaniesItemComponent } from './users-details-tab-companies-item/users-details-tab-companies-item.component';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { PreviewPhoneMaskModule } from '../../shared/preview-phone-mask/preview-phone-mask.module';
import { UserTableDefaultSubscriptionModule } from '../../users/users-table/user-table-default-subscription/user-table-default-subscription.module';
import { ClickOutsideModule } from 'src/app/directives/click-otside/click-otside.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';


@NgModule({
  declarations: [UsersDetailsTabCompaniesComponent,
    UsersDetailsTabCompaniesAddComponent,
    UsersDetailsTabCompaniesItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DropDownModule,
    CompanyDropDownModule,
    PreviewPhoneMaskModule,
    UserTableDefaultSubscriptionModule,
    ClickOutsideModule,
    NgbModule,
    DisabledBtnModule,
    PreloaderTicketModule,
    DynamicTooltipModule
  ],
  exports: [UsersDetailsTabCompaniesComponent]
})
export class UsersDetailsTabCompaniesModule { }
