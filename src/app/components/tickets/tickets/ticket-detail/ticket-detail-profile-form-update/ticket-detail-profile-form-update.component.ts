import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RemoteSession } from 'src/app/components/support/class/remote-sessions';
import { User } from 'src/app/components/users/class/user';
import { USERS_TO_ADD_UPDATE } from 'src/app/const/add-users-notify';
import { CurrentUser } from 'src/class/current-user/current-user';
import { AddAssignedUserComponent } from '../../ticket-edit-aside/add-assigned-user/add-assigned-user.component';
import { TicketProfileFormUpdateComponent } from '../../ticket-edit-aside/ticket-profile-form-update/ticket-profile-form-update.component';

@Component({
  selector: 'ticket-detail-profile-form-update',
  templateUrl: './ticket-detail-profile-form-update.component.html',
  styleUrls: ['./ticket-detail-profile-form-update.component.scss']
})
export class TicketDetailProfileFormUpdateComponent extends TicketProfileFormUpdateComponent {
  @ViewChild('addAssignedUser') addAssignedUser: AddAssignedUserComponent;
  selectedUsers: Array<CurrentUser> = [];
  usersForUpdate: Array<User> = [];
  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    this.usersStateService.onGetCurrentUser.subscribe(data => {
      this.currentUser = data;
    })
    let oneTimeConnectionArray = this.devicesRealTimeService.oneTimeConnectionArray.subscribe(newChange => {
      if (newChange.action === 'ONE_TIME_DOWNLOADED' || newChange.action === 'ONE_TIME_INSTALLED' || newChange.action === 'ONE_TIME_CONNECTION_OPEN' || newChange.action === 'ONE_TIME_URL_GENERATED' || newChange.action === 'ONE_TIME_URL_OPEN' || newChange.action === 'ONE_TIME_ONLINE' || newChange.action === 'ONE_TIME_OFFLINE') {
        if (newChange.data.oneTime) {
          if (this.remoteSession && this.remoteSession.id === newChange.data.id) this.remoteSession = new RemoteSession(newChange.data);
        }
      }
      if (newChange.action === 'ONE_TIME_DELETED' || newChange.action === 'ONE_TIME_UNINSTALLED') {
        newChange.data.forEach(element => {
          if (this.remoteSession && this.remoteSession.id === element) this.remoteSession = null;
        });
      }
      this.cd.detectChanges();
    })
    this.sub.add(oneTimeConnectionArray);
    let getOnTicketClosed = this.ticketStateService.getOnTicketClosed().subscribe(data => {
      if (this.remoteSession) this.removeSession();
    })
    this.sub.add(getOnTicketClosed);
    let getOnEditTicket = this.ticketsStateService.getOnEditTicket().subscribe(data => {
      if (this.remoteSession) this.removeSession();
    })
    this.sub.add(getOnEditTicket);
    this.ticketStateService.onSetTabUpdate.subscribe(data => {
      this.setTab(data);
    })
    let onChangeAssignedUser = this.addUsersNotifyStateService.onChangeAssignedUser.subscribe(data => {
      if (this.addUsersNotifyStateService.getAction() === USERS_TO_ADD_UPDATE) {
        this.ticketProfileFormUpdate.clearShares();
        data.forEach(element => this.ticketProfileFormUpdate.toggleShares(element));
      }
    })
    this.sub.add(onChangeAssignedUser);
    this.usersForUpdate = this.getUsersForUpdate();
  }
  public onChangeType(data) {
    this.ticketProfileFormUpdate.setNoteType(data);
    this.usersForUpdate = this.getUsersForUpdate();
    console.log("this.usersForUpdate", this.usersForUpdate);
    this.addAssignedUser.resetList(this.usersForUpdate);
  }
  onSelectUpdateUser(data) {
    this.selectedUsers = data;
    this.ticketProfileFormUpdate.setShares(data);
  }
  getUsersForUpdate() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    let techusers = userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);
    let clientUsers = userList.filter((item) => item.accountType === "CLIENT" && !item.deletedAt && item.company.id === this.ticketProfile.company.id);
    if (this.ticketProfileFormUpdate.noteType == "PUBLIC") return [...techusers, ...clientUsers];
    if (this.ticketProfileFormUpdate.noteType == "PRIVATE") return [...techusers];
  }
}
