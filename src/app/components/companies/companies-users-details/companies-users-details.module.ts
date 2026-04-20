import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesUsersDetailsComponent } from './companies-users-details.component';
import { CompaniesUsersDetailsRoutingModule } from './companies-users-details-routing.module';
import { FormsModule } from '@angular/forms';

import { UsersDetailsLeftPanelModule } from '../../users-details/users-details-left-panel/users-details-left-panel.module';
import { UsersDetailsTabCompaniesModule } from '../../users-details/users-details-tab-companies/users-details-tab-companies.module';






@NgModule({
    imports: [
    CommonModule,
    CompaniesUsersDetailsRoutingModule,
    FormsModule,
    UsersDetailsLeftPanelModule,
    UsersDetailsTabCompaniesModule,
    CompaniesUsersDetailsComponent
],
})
export class CompaniesUsersDetailsModule { }
