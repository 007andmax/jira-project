import { Component, OnInit } from '@angular/core';
import { AddAssignedUserComponent } from 'src/app/components/tickets/tickets/ticket-edit-aside/add-assigned-user/add-assigned-user.component';

@Component({
  selector: 'modal-add-users-notify',
  templateUrl: './modal-add-users-notify.component.html',
  styleUrls: ['./modal-add-users-notify.component.scss']
})
export class ModalAddUsersNotifyComponent extends AddAssignedUserComponent {



  isSelected(user) {
    return this.selectedUsers.find(item => item.id === user.id);
  }
  public toggleUser(data): void {
    let index = this.selectedUsers.findIndex(item => item.id === data.id);
    if (index === -1) {
      this.selectedUsers.push(data);
      this.onSelected.emit(this.selectedUsers);
    } else {
      this.selectedUsers.splice(index, 1);
    }
    this.userInput.nativeElement.blur();
    this.userCtrl.setValue(null);
    this.userInput.nativeElement.value = '';
    this.users = JSON.parse(JSON.stringify(this.userList));
    this.reqUsers = JSON.parse(JSON.stringify(this.userList));
  }
  applyUsers() {
    this.ticketStateService.setAssignUser(this.selectedUsers);
    this.close();
  }
  close() {
    this.activeModal.dismiss('Cross click');
  }
}
