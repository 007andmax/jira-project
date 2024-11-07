import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesUsersDetailsComponent } from './companies-users-details.component';
import { CompaniesUsersDetailsRoutingModule } from './companies-users-details-routing.module';
import { FormsModule } from '@angular/forms';
import { UsersDetailsHeaderModule } from '../../users-details/users-details-header/users-details-header.module';
import { UsersDetailsLeftPanelModule } from '../../users-details/users-details-left-panel/users-details-left-panel.module';
import { UsersDetailsTabCompaniesModule } from '../../users-details/users-details-tab-companies/users-details-tab-companies.module';
import { UsersDetailsTabDocumentsModule } from '../../users-details/users-details-tab-documents/users-details-tab-documents.module';
import { UsersDetailsTabMessagesModule } from '../../users-details/users-details-tab-messages/users-details-tab-messages.module';
import { UsersDetailsTabPasswordsModule } from '../../users-details/users-details-tab-passwords/users-details-tab-passwords.module';
import { UsersDetailsTabTicketsModule } from '../../users-details/users-details-tab-tickets/users-details-tab-tickets.module';


@NgModule({
    declarations: [
        CompaniesUsersDetailsComponent
    ],
    imports: [
        CommonModule,
        CompaniesUsersDetailsRoutingModule,
        FormsModule,
        UsersDetailsHeaderModule,
        UsersDetailsLeftPanelModule,
        UsersDetailsTabCompaniesModule,
        UsersDetailsTabDocumentsModule,
        UsersDetailsTabMessagesModule,
        UsersDetailsTabPasswordsModule,
        UsersDetailsTabTicketsModule

    ],

})
export class CompaniesUsersDetailsModule { }
