import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RemoteSession } from 'src/app/components/support/class/remote-sessions';
import { User } from 'src/app/components/users/class/user';
import { USERS_TO_ADD_UPDATE } from 'src/app/const/add-users-notify';
import { CurrentUser } from 'src/class/current-user/current-user';
import { AddAssignedUserComponent } from '../../ticket-edit-aside/add-assigned-user/add-assigned-user.component';
import { TicketProfileFormUpdateComponent } from '../../ticket-edit-aside/ticket-profile-form-update/ticket-profile-form-update.component';
import { TicketDetailProfileFormUpdateNoteComponent } from './ticket-detail-profile-form-update-note/ticket-detail-profile-form-update-note.component';
import { TicketDetailProfileFormUpdateProductsComponent } from './ticket-detail-profile-form-update-products/ticket-detail-profile-form-update-products.component';
import { TicketDetailProfileFormUpdateServicesComponent } from './ticket-detail-profile-form-update-services/ticket-detail-profile-form-update-services.component';

@Component({
  selector: 'ticket-detail-profile-form-update',
  templateUrl: './ticket-detail-profile-form-update.component.html',
  styleUrls: ['./ticket-detail-profile-form-update.component.scss']
})
export class TicketDetailProfileFormUpdateComponent extends TicketProfileFormUpdateComponent {
  @ViewChild('selectNote') selectNote: TicketDetailProfileFormUpdateNoteComponent;
  @ViewChild('selectServices') selectServices: TicketDetailProfileFormUpdateServicesComponent;
  @ViewChild('selectProducts') selectProducts: TicketDetailProfileFormUpdateProductsComponent;
  @Output() onCloseForm = new EventEmitter();
  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    this.ticketProfileFormUpdate.setTechUser(this.currentUser);
    this.usersStateService.onGetCurrentUser.subscribe(data => {
      this.currentUser = data;
      this.ticketProfileFormUpdate.setTechUser(this.currentUser);
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
    let onSetTabUpdate = this.ticketStateService.onSetTabUpdate.subscribe(data => {
      this.setTab(data);
    })
    this.sub.add(onSetTabUpdate);
    let onChangeAssignedUser = this.addUsersNotifyStateService.onChangeAssignedUser.subscribe(data => {
      if (this.addUsersNotifyStateService.getAction() === USERS_TO_ADD_UPDATE) {
        this.ticketProfileFormUpdate.clearShares();
        data.forEach(element => this.ticketProfileFormUpdate.toggleShares(element));
      }
    })
    this.sub.add(onChangeAssignedUser);
    //if (this.tab === 'NOTE' && this.noteList) this.noteList.onGetNoteList();
    this.ticketProfileFormUpdate.setType(this.tab);
    if (this.tab == "NOTE" && this.customerPortalStateService.isCustomerPortal) this.ticketProfileFormUpdate.setNoteType("PUBLIC");
    $("ticket-detail-profile-form-update").css({ left: $(".ticket-detail-page-content__body").offset().left - 64 });
    window.addEventListener('resize', this.resize);
  }
  resize = () => {
    $("ticket-detail-profile-form-update").css({ left: $(".ticket-detail-page-content__body").offset().left - 64 });
  }


  onUpdateTicket(data) {
    this.updateBtn.setDisabled(true);
    this.isUpdate = true;
    this.ticketsService.updateTicket(data).subscribe(data => {
      this.isUpdate = false;
      this.updateBtn.setDisabled(false);
      this.close();
    }, err => {
      this.isUpdate = false;
      this.updateBtn.setDisabled(false);
    })
  }
  close() {
    this.onCloseForm.emit(null);
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resize);
    this.sub.unsubscribe();
  }
}
