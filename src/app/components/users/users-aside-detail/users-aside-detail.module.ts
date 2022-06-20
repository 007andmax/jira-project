import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersAsideDetailComponent } from './users-aside-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { MatChipsModule, MatFormFieldModule } from '@angular/material';
import { CompanySubscriptionModule } from '../../companies/company-subscription/company-subscription.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { UsersAsideDetailTicketsComponent } from './users-aside-detail-tickets/users-aside-detail-tickets.component';
import { UsersAsideDetailDocumentsComponent } from './users-aside-detail-documents/users-aside-detail-documents.component';
import { UsersAsideDetailPasswordsComponent } from './users-aside-detail-passwords/users-aside-detail-passwords.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UsersAsideDetailTicketsItemComponent } from './users-aside-detail-tickets/users-aside-detail-tickets-item/users-aside-detail-tickets-item.component';
import { UsersAsideDetailDocumentsItemComponent } from './users-aside-detail-documents/users-aside-detail-documents-item/users-aside-detail-documents-item.component';
import { DocumentsTemplatesInfoModule } from '../../documents/documents-templates/documents-templates-info/documents-templates-info.module';
import { UsersAsideDetailPasswordsItemComponent } from './users-aside-detail-passwords/users-aside-detail-passwords-item/users-aside-detail-passwords-item.component';
import { UserDefaultSubscriptionModule } from '../users-aside/user-default-subscription/user-default-subscription.module';
import { UserCustomSubscriptionModule } from '../users-aside/user-custom-subscription/user-custom-subscription.module';
import { UsersAsideDetailMessagesComponent } from './users-aside-detail-messages/users-aside-detail-messages.component';
import { UsersAsideDetailMessagesFullBodyComponent } from './users-aside-detail-messages/users-aside-detail-messages-full-body/users-aside-detail-messages-full-body.component';
import { TicketProfileAttachmentsModule } from '../../tickets/tickets/ticket-edit-aside/ticket-profile-attachments/ticket-profile-attachments.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    declarations: [UsersAsideDetailComponent,
        UsersAsideDetailTicketsComponent,
        UsersAsideDetailDocumentsComponent,
        UsersAsideDetailPasswordsComponent,
        UsersAsideDetailTicketsItemComponent,
        UsersAsideDetailDocumentsItemComponent,
        UsersAsideDetailPasswordsItemComponent,
        UsersAsideDetailMessagesComponent,
        UsersAsideDetailMessagesFullBodyComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        DropDownModule,
        MatFormFieldModule,
        CompanySubscriptionModule,
        TextAreaModule,
        CompanyTagsModule,
        InfiniteScrollModule,
        DocumentsTemplatesInfoModule,
        UserDefaultSubscriptionModule,
        UserCustomSubscriptionModule,
        TicketProfileAttachmentsModule,
        NgxMaskModule.forRoot(),
    ],
    exports: [UsersAsideDetailComponent]

})
export class UsersAsideDetailModule { }
