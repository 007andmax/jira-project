import { Component, OnInit } from '@angular/core';
import { UserListService } from '../../users/services/user-list.service';
import { UsersAsideDetailMessagesComponent } from '../../users/users-aside-detail/users-aside-detail-messages/users-aside-detail-messages.component';

@Component({
  selector: 'app-users-details-tab-messages',
  templateUrl: './users-details-tab-messages.component.html',
  styleUrls: ['./users-details-tab-messages.component.scss'],
  providers: [UserListService]
})
export class UsersDetailsTabMessagesComponent extends UsersAsideDetailMessagesComponent {


}
