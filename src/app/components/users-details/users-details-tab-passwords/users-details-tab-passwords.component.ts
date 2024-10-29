import { Component, OnInit } from '@angular/core';
import { UsersAsideDetailPasswordsComponent } from '../../users/users-aside-detail/users-aside-detail-passwords/users-aside-detail-passwords.component';
import { PasswordManagerListService } from '../../password-manager/services/password-manager-list.service';

@Component({
  selector: 'app-users-details-tab-passwords',
  templateUrl: './users-details-tab-passwords.component.html',
  styleUrls: ['./users-details-tab-passwords.component.scss'],
  providers: [PasswordManagerListService]
})
export class UsersDetailsTabPasswordsComponent extends UsersAsideDetailPasswordsComponent {


}
