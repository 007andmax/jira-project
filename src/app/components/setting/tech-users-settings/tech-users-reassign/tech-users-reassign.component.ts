
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TechUsersService } from 'src/app/services/setting/tech-users.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  standalone: true,
  imports: [DropDownComponent, CommonModule],
  selector: 'tech-users-reassign',
  templateUrl: './tech-users-reassign.component.html',
  styleUrls: ['./tech-users-reassign.component.scss'],

})
export class TechUsersReassignComponent implements OnInit, OnDestroy {
  namesTechUsersList = [];
  techUsersList = [];
  @Input() techUser;
  selectedUser;
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    public activeModal: NgbActiveModal,
    private confirmStateService: ConfirmStateService,
    private techUsersService: TechUsersService,) { }


  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0) this.onGetTechUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.onGetTechUsers(this.usersStateService.getAllUsers());
    })
    this.sub.add(onChangeUsers);
  }
  onGetTechUsers(data) {
    this.techUsersList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt && item.id != this.techUser.id) {
        return item;
      }
    });
    this.namesTechUsersList = this.getTechUserList();
  }
  getTechUserList() {
    return this.techUsersList.map(item => {
      return `${item.firstName} ${item.lastName}`
    }).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
  }
  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };
  approveConfirm() {
    let indexTechUser = this.techUsersList.findIndex(user => `${user.firstName} ${user.lastName}` === this.selectedUser);
    if (indexTechUser > -1) {
      this.techUsersService
        .archiveUser(this.techUser.id, this.techUsersList[indexTechUser].id)
        .subscribe((data) => {
          this.activeModal.close();
          this.confirmStateService.setConfirm(true);
        });
    }
  };
  onSelectTechUser(item) {
    this.selectedUser = item;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
