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
  ],
  exports: [UsersDetailsTabCompaniesComponent]
})
export class UsersDetailsTabCompaniesModule { }
