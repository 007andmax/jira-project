import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersDetailsRoutingModule } from './users-details-routing.module';
import { UsersDetailsComponent } from './users-details.component';
import { UsersDetailsHeaderModule } from './users-details-header/users-details-header.module';
import { UsersDetailsLeftPanelModule } from './users-details-left-panel/users-details-left-panel.module';
import { UsersDetailsTabCompaniesModule } from './users-details-tab-companies/users-details-tab-companies.module';
import { UsersDetailsTabDocumentsModule } from './users-details-tab-documents/users-details-tab-documents.module';
import { UsersDetailsTabMessagesModule } from './users-details-tab-messages/users-details-tab-messages.module';
import { UsersDetailsTabPasswordsModule } from './users-details-tab-passwords/users-details-tab-passwords.module';
import { UsersDetailsTabTicketsModule } from './users-details-tab-tickets/users-details-tab-tickets.module';


@NgModule({
    declarations: [UsersDetailsComponent,
    ],
    imports: [
        CommonModule,
        UsersDetailsRoutingModule,
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
export class UsersDetailsModule { }
