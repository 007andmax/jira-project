import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersDetailsTabCompaniesAddComponent } from './users-details-tab-companies-add/users-details-tab-companies-add.component';
import { UsersDetailsTabCompaniesComponent } from './users-details-tab-companies.component';
import { UsersDetailsTabCompaniesItemComponent } from './users-details-tab-companies-item/users-details-tab-companies-item.component';
import { FormsModule } from '@angular/forms';


import { PreviewPhoneMaskModule } from '../../shared/preview-phone-mask/preview-phone-mask.module';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';





@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    PreviewPhoneMaskModule,
    NgbModule,
    UsersDetailsTabCompaniesComponent,
    UsersDetailsTabCompaniesAddComponent,
    UsersDetailsTabCompaniesItemComponent
],
    exports: [UsersDetailsTabCompaniesComponent]
})
export class UsersDetailsTabCompaniesModule { }
