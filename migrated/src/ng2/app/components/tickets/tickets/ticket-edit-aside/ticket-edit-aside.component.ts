import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { TicketProfile } from '../class/ticket-profile';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import * as moment from "moment";
import { StatusColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/tickets-color';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { DevicesSateService } from 'src/ng2/app/states/devices/devices-sate.service';
import { TicketsPermissionsService } from './services/tickets-permissions.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { TicketsListService } from '../services/tickets-list.service';
import { TicketStateService } from './services/ticket-state.service';
import { NotificationStateService } from '../../../shared/notification/services/notification-state.service';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MOVE_TO_TRASH_TICKET, DELETE_FOREVER, MOVE_TO_SPAM_OR_REPORT_TICKET } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { TicketProfileFormUpdateComponent } from './ticket-profile-form-update/ticket-profile-form-update.component';
import { Ticket } from '../../class/ticket';
import { TicketChangeField } from '../class/ticket-change-field';
import { WebsocketService } from 'src/ng2/app/services/websocket/websocket.service';
import { TicketProfileUpdate } from '../class/ticket-profile-update';
import { Subscription } from 'rxjs';
import { TicketEditAsideRightPanelComponent } from './ticket-edit-aside-right-panel/ticket-edit-aside-right-panel.component';
@Component({
  selector: 'app-ticket-edit-aside',
  templateUrl: './ticket-edit-aside.component.html',
  styleUrls: ['./ticket-edit-aside.component.scss'],
  providers: [TicketsListService, TicketsPermissionsService]

})
export class TicketEditAsideComponent implements OnInit, OnDestroy {

  @ViewChild('updateForm') updateForm: TicketProfileFormUpdateComponent;
  @ViewChild('rightPanel') rightPanel: TicketEditAsideRightPanelComponent;
  ticketProfile: TicketProfile = new TicketProfile();
  opened = false;
  modeSubject = 'view';
  modeDescription = 'view';
  showAddAssignedUser = false;
  showPreloader: boolean = true;
  listColors: Array<StatusColor> = [];
  statusColor: TicketsColor;
  listAssignedUser: Array<CurrentUser> = [];
  lisUpdateUser: Array<CurrentUser> = [];


  sub: Subscription = new Subscription();
  constructor(private ticketsStateService: TicketsStateService,
    private confirmStateService: ConfirmStateService,
    private ticketsService: TicketsService,
    private elRef: ElementRef,
    public ticketsListService: TicketsListService,
    private usersStateService: UsersStateService,
    private ticketStateService: TicketStateService,
    public ticketsPermissionsService: TicketsPermissionsService,
    private notificationStateService: NotificationStateService,
    public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService) { }


  ngOnInit() {
    this.ticketsStateService.getOnOpenTicket().subscribe(data => {
      this.showPreloader = true;
    })
    let getOnEditTicket = this.ticketsStateService.getOnEditTicket().subscribe(data => {
      this.ticketStateService.unsubscribeTicket();
      if (this.updateForm) this.updateForm.reset();
      this.ticketProfile = data;
      this.elRef.nativeElement.querySelector("#ticket-note").value = this.ticketProfile.note;
      this.updateListAssignedUser();
      this.updateLisUpdateUser();
      this.opened = true;
      this.showPreloader = false;
      this.ticketStateService.getServicesList(this.ticketProfile);
      this.ticketStateService.subsribeToTicket(this.ticketProfile.id);
      this.cd.detectChanges();
    })
    this.sub.add(getOnEditTicket);
    this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.ticketsStateService.getOnInitStatus().subscribe(data => {
      this.statusColor = data;
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_FOREVER) {
          this.onDeleteForever();
        }
        if (this.confirmStateService.getConfirmAction() === MOVE_TO_SPAM_OR_REPORT_TICKET) {
          this.onMoveIntoSpam();
        }

      }
    })
    this.ticketsStateService.getOnUpdateTicket().subscribe(data => {

      if (this.opened) {
        let ticket = new Ticket(data);
        if (this.ticketProfile.id === ticket.id) {
          this.ticketProfile.update(data);
          this.elRef.nativeElement.querySelector("#ticket-note").value = this.ticketProfile.note;
          this.updateListAssignedUser();
          this.updateLisUpdateUser();
        }
      }


    })

    this.ticketsStateService.getOnRemoveTicket().subscribe(data => {
      if (this.opened) {
        if (this.ticketProfile.id === data.id) this.close();
      }
    });
    this.ticketsStateService.getOnChangeFieldTicket().subscribe((data: TicketChangeField) => {
      if (this.opened) {
        if (this.ticketProfile.id === data.id) this.ticketProfile[data.field] = data.value;
      }
    });
    this.ticketStateService.getOnChangeUpdatesTicket().subscribe(newChange => {

      if (newChange.action == 'UPDATE_SAVED' || newChange.action == 'UPDATE_CREATED') {
        let update = this.ticketProfile.updates.find(item => item.id === newChange.data.id),
          attachments = newChange.data.attachments;
        if (update) {
          this.ticketProfile.setUpdate(newChange.data);
        } else {
          this.ticketProfile.addUpdate(newChange.data);
        }
        if (attachments && attachments.length) {
          for (var i = 0; i < attachments.length; i++) {
            this.ticketProfile.addAttachment(attachments[i]);
          }
        }
      }
      if (newChange.action == 'UPDATE_DELETED') this.ticketProfile.removeUpdate(newChange.data);
      this.cd.detectChanges();
    });
  }
  private updateListAssignedUser() {
    this.listAssignedUser = [];
    if (this.ticketProfile.assignedUser) this.listAssignedUser.push(this.ticketProfile.assignedUser);
    if (this.ticketProfile.multiAssignedUsers) this.listAssignedUser = [...this.listAssignedUser, ...this.ticketProfile.multiAssignedUsers];
    console.log("listAssignedUser",this.listAssignedUser);
  }
  private updateLisUpdateUser() {
    this.lisUpdateUser = [];
    this.lisUpdateUser = this.ticketProfile.updates.map(item => item.user);
    this.lisUpdateUser = [...this.listAssignedUser, ...this.lisUpdateUser]
    this.lisUpdateUser = this.lisUpdateUser.filter((item, index) => this.lisUpdateUser.findIndex(user => user.id === item.id) === index);
    if (this.ticketProfile.createdUser) {
      let find = this.lisUpdateUser.find(item => item.id === this.ticketProfile.createdUser.id);
      if (!find) this.lisUpdateUser.push(find);
    }
    console.log("lisUpdateUser",this.lisUpdateUser);
  }
  onMoveIntoSpam() {
    if (this.usersStateService.getCurrentUser().isOwner) {
      this.ticketsService.markAsSpamTicket(this.ticketProfile.id, false).subscribe(data => {
        this.notificationStateService.oninitShowNotification(`The ticket “${this.ticketProfile.number}” has been marked as spam`);
      });
    } else {
      this.ticketsService.reportAsSpamTicket(this.ticketProfile.id, false).subscribe(data => {
        this.notificationStateService.oninitShowNotification(`The ticket “${this.ticketProfile.number}” has been reported as spam`);

      });
    }
  }
  moveToTrash(data) {
    this.ticketsService.trashTicket(this.ticketProfile.id, data).subscribe(res => {
      if (data) {
        this.notificationStateService.oninitShowNotification(`The ticket “${this.ticketProfile.number}” has been moved to Trash`);
      }
    })
  }
  restoreFromSpam() {
    this.ticketsService.restoreFromSpam(this.ticketProfile.id, false).subscribe(data => {

    })
  }
  onFetchUpdates(resp) {
    let updates = this.ticketProfile.updates || [];
    updates = [...updates, ...resp.map(item => {
      return new TicketProfileUpdate(item);
    })];
    this.ticketProfile.updates = updates;
    this.cd.detectChanges();
  }
  onChangeTags(data) {
    if (!this.opened) return;
    this.ticketProfile.tags = data;

    let tags = this.ticketProfile.tags.map(item => {
      return {
        id: item.id,
        word: item.word,
        colorCode: 0,
        usedCounter: item.usedCounter,
      }
    })
    this.ticketsService.addTags(this.ticketProfile.id, tags).subscribe(res => {

    })
  }
  getUsersForAssign() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);

  }

  toggleSubject() {
    this.modeSubject = (this.modeSubject === 'view') ? 'edit' : 'view';
    if (this.modeSubject === 'view') this.onChangeSubjectNote();
  }
  toggleNote() {
    if (this.elRef.nativeElement.querySelector("#ticket-note").value != this.ticketProfile.note) {
      this.ticketProfile.note = this.elRef.nativeElement.querySelector("#ticket-note").value;
      this.onChangeSubjectNote();

    }
  }
  onChangeSubjectNote() {
    this.ticketsService.changeSubjectNoteTicket(this.ticketProfile.id, this.ticketProfile.subject, this.ticketProfile.note).subscribe(data => {
    })
  }
  markAsOpen() {
    this.ticketsService.changeStatus(this.ticketProfile.id, 'IN_PROGRESS').subscribe((data: any) => {
      if (data.code == 403) {
        var user = this.usersStateService.getAllUsers().find(item => item.id === data.message);
        this.notificationStateService.oninitShowNotification(`${this.getUserName(user)} locked this ticket to create invoice!`);
        return;
      }
      this.notificationStateService.oninitShowNotification(`The ticket “${this.ticketProfile.number}” has been marked as open`);
    })
  };
  onDeleteForever() {
    this.ticketsService.deleteTicket([this.ticketProfile.id]).subscribe(data => {
      this.notificationStateService.oninitShowNotification(`The ticket “${this.ticketProfile.number}” has been deleted`);
    })
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  onSelectAssignedUser(data) {
    this.listAssignedUser = data;
  }
  onToggleAddAssignedUser() {
    this.showAddAssignedUser = !this.showAddAssignedUser;

    if (!this.showAddAssignedUser && this.listAssignedUser.length > 0 && !this.checkAssignedUser()) {
      let ids = this.listAssignedUser.map(item => {
        return item.id;
      })
      this.ticketsService.addAssignUsers(this.ticketProfile.id, ids).subscribe(data => {

      })
    }
  }
  private checkAssignedUser() {
    let listAssignedUser = [];
    if (this.ticketProfile.assignedUser) listAssignedUser.push(this.ticketProfile.assignedUser);
    if (this.ticketProfile.multiAssignedUsers) listAssignedUser = [...listAssignedUser, ...this.ticketProfile.multiAssignedUsers];
    if (listAssignedUser.length != this.listAssignedUser.length) return false;
    for (let i = 0; i < listAssignedUser.length; i++) {
      let find = this.listAssignedUser.find(item => item.id === listAssignedUser[i].id);
      if (!find) return false;
    }
    return true;
  }
  claimTicket() {
    let currentUser = this.usersStateService.getCurrentUser();
    var indexUser = this.ticketProfile.multiAssignedUsers.findIndex(user => user.id === currentUser.id);
    var value = [];
    this.ticketProfile.multiAssignedUsers.forEach(user => {
      value.push(user.id);
    })

    if (this.ticketProfile.assignedUser && this.ticketProfile.assignedUser.id !== currentUser.id && indexUser === -1) {
      value.push(this.ticketProfile.assignedUser.id);
      value.push(currentUser.id);
    } else if (this.ticketProfile.assignedUser && this.ticketProfile.assignedUser.id !== currentUser.id && indexUser > -1) {
      value.push(this.ticketProfile.assignedUser.id);
    } else if (this.ticketProfile.assignedUser && this.ticketProfile.assignedUser.id === currentUser.id && indexUser === -1) {
      value.push(this.ticketProfile.assignedUser.id);
    } else if (!this.ticketProfile.assignedUser && indexUser === -1) {
      value.push(currentUser.id);
    }
    this.ticketsService.assignUserToTicket(this.ticketProfile.id, value.join(",")).subscribe(res => {
    })

  };
  getCompantName() {
    let find = this.companiesStateService.getCompanies().find(item => item.id === this.ticketProfile.companyId);
    return (find) ? find.name : '';
  }
  getNameCreateUser() {
    if (!this.ticketProfile.createdUser) return '';
    return `${this.ticketProfile.createdUser.firstName} ${this.ticketProfile.createdUser.lastName}`
  }

  getCreatAt() {
    let date = new Date(this.ticketProfile.createdAt);
    let hours = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours();
    let type = (date.getHours() >= 12) ? 'pm' : 'am';
    return `${moment(date).format('DD MMM YYYY')}, ${(hours < 10 ? '0' + hours : hours)}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()} ${type}`
  }
  getStyleStatus(field) {
    return { 'border-color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].borderColor : null, 'background-color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].backgroundColor : null, 'color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].borderColor : null }
  }
  parseTicketSource() {
    if (!this.ticketProfile.ticketSource) {
      return '';
    }
    var words = this.ticketProfile.ticketSource.split('_'),
      result = '';
    for (var i = 0, len = words.length; i < len; i++) {
      var word = words[i];
      result += word[0].toUpperCase() + word.slice(1).toLowerCase();
      if (i !== len - 1) {
        result += ' ';
      }
    }
    return result;
  };
  getAgentName() {
    if (!this.ticketProfile.agent || !this.ticketProfile.agent.label)     return '';
    return `, Agent - ${this.ticketProfile.agent.label}`;
  }
  close() {
    this.ticketProfile = new TicketProfile();
    this.opened = false;
    this.modeSubject = 'view';
    this.modeDescription = 'view';
    this.showAddAssignedUser = false;
    this.showPreloader = true;
    this.listAssignedUser = [];
    this.rightPanel.close();
    this.ticketStateService.unsubscribeTicket();
    this.ticketStateService.onTicketClosed();
  }
  getClassType() {
    return `priority-icon ticket-edit-aside__ticket-subject-flag ${(this.ticketProfile.priorityLevel && this.ticketProfile.priorityLevel !== "MEDIUM") ? '--' + this.ticketProfile.priorityLevel.toLowerCase() : ''}`;
  }
  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
