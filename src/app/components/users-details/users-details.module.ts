import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersDetailsRoutingModule } from './users-details-routing.module';
import { UsersDetailsComponent } from './users-details.component';

import { UsersDetailsLeftPanelModule } from './users-details-left-panel/users-details-left-panel.module';
import { UsersDetailsTabCompaniesModule } from './users-details-tab-companies/users-details-tab-companies.module';






@NgModule({
    imports: [
    CommonModule,
    UsersDetailsRoutingModule,
    FormsModule,
    UsersDetailsLeftPanelModule,
    UsersDetailsTabCompaniesModule,
    UsersDetailsComponent
],
})
export class UsersDetailsModule { }
