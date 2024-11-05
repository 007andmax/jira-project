import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersDetailsTabMessagesFullBodyComponent } from './users-details-tab-messages-full-body/users-details-tab-messages-full-body.component';
import { UsersDetailsTabMessagesComponent } from './users-details-tab-messages.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TicketProfileAttachmentsModule } from '../../tickets/tickets/ticket-edit-aside/ticket-profile-attachments/ticket-profile-attachments.module';


@NgModule({
  declarations: [UsersDetailsTabMessagesComponent,
    UsersDetailsTabMessagesFullBodyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InfiniteScrollModule,
    TicketProfileAttachmentsModule,
  ],
  exports: [UsersDetailsTabMessagesComponent]
})
export class UsersDetailsTabMessagesModule { }
