import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/ng2/app/components/users/class/user';

@Component({
  selector: 'app-contracts-aside-block-time-billing-users',
  templateUrl: './contracts-aside-block-time-billing-users.component.html',
  styleUrls: ['./contracts-aside-block-time-billing-users.component.scss']
})
export class ContractsAsideBlockTimeBillingUsersComponent implements OnInit {
  @Input() selectedUsers = [];
  @Output() onSelected = new EventEmitter<any>();
  selectable = true;
  removable = true;
  constructor() { }

  ngOnInit() {
  }
  public remove(index): void {
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
      this.onSelected.emit(this.selectedUsers);
    }
  }
  getAssignedUserNameForAvatar(user) {
    if (!user) return '';
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  getStyleAvatar(user) {
    if (!(user && user.avatar)) {
      return '#16a4fa';
    }
    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) no-repeat`;
    } else {
      return '#16a4fa';
    }
  };
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }

}
