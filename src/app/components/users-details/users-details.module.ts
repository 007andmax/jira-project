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
import { UsersAsideDetailTicketsModule } from '../users/users-aside-detail/users-aside-detail-tickets/users-aside-detail-tickets.module';
import { UsersDetailsTabTicketsComponent } from './users-details-tab-tickets/users-details-tab-tickets.component';
import { UsersDetailsTabTicketsItemComponent } from './users-details-tab-tickets/users-details-tab-tickets-item/users-details-tab-tickets-item.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersDetailsTabPasswordsComponent } from './users-details-tab-passwords/users-details-tab-passwords.component';
import { UsersDetailsTabPasswordsItemComponent } from './users-details-tab-passwords/users-details-tab-passwords-item/users-details-tab-passwords-item.component';
import { UsersDetailsTabDocumentsComponent } from './users-details-tab-documents/users-details-tab-documents.component';
import { UsersDetailsTabDocumentsItemComponent } from './users-details-tab-documents/users-details-tab-documents-item/users-details-tab-documents-item.component';
import { DocumentsTemplatesInfoModule } from '../documents/documents-templates/documents-templates-info/documents-templates-info.module';
import { UsersDetailsTabMessagesComponent } from './users-details-tab-messages/users-details-tab-messages.component';
import { UsersDetailsTabMessagesFullBodyComponent } from './users-details-tab-messages/users-details-tab-messages-full-body/users-details-tab-messages-full-body.component';
import { TicketProfileAttachmentsModule } from '../tickets/tickets/ticket-edit-aside/ticket-profile-attachments/ticket-profile-attachments.module';


@NgModule({
    declarations: [UsersDetailsComponent,
        UsersDetailsHeaderComponent,
        UsersDetailsLeftPanelComponent,
        UsersDetailsTabCompaniesComponent,
        UsersDetailsTabCompaniesItemComponent,
        UsersDetailsTabCompaniesAddComponent,
        UsersDetailsTabTicketsComponent,
        UsersDetailsTabTicketsItemComponent,
        UsersDetailsTabPasswordsComponent,
        UsersDetailsTabPasswordsItemComponent,
        UsersDetailsTabDocumentsComponent,
        UsersDetailsTabDocumentsItemComponent,
        UsersDetailsTabMessagesComponent,
        UsersDetailsTabMessagesFullBodyComponent,
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
        ClickOutsideModule,
        InfiniteScrollModule,
        DocumentsTemplatesInfoModule,
        TicketProfileAttachmentsModule
    ],
})
export class UsersDetailsModule { }
