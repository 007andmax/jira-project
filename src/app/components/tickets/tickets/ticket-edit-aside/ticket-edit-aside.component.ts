import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketProfile } from '../class/ticket-profile';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import * as moment from "moment";
import { StatusColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/tickets-color';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { TicketsPermissionsService } from './services/tickets-permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../services/tickets-list.service';
import { TicketStateService } from './services/ticket-state.service';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MOVE_TO_TRASH_TICKET, DELETE_FOREVER, MOVE_TO_SPAM_OR_REPORT_TICKET } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { TicketProfileFormUpdateComponent } from './ticket-profile-form-update/ticket-profile-form-update.component';
import { Ticket } from '../../class/ticket';
import { TicketChangeField } from '../class/ticket-change-field';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { TicketProfileUpdate } from '../class/ticket-profile-update';
import { Subscription } from 'rxjs';
import { TicketEditAsideRightPanelComponent } from './ticket-edit-aside-right-panel/ticket-edit-aside-right-panel.component';
import { TicketMessageComponent } from './ticket-message/ticket-message.component';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { ModalAddUpdateTicketComponent } from 'src/app/services/modal/modal-add-update-ticket/modal-add-update-ticket.component';
import { AppService } from 'src/app/states/app/app.service';
import { ModalAddUsersNotifyComponent } from 'src/app/services/modal/modal-add-users-notify/modal-add-users-notify.component';
import { TicketProfileEditFormUpdateComponent } from './ticket-profile-edit-form-update/ticket-profile-edit-form-update.component';
import { AddUsersNotifyStateService } from 'src/app/services/modal/modal-add-users-notify/state/add-users-notify-state.service';
import { USERS_TO_EDIT_TICKET } from 'src/app/const/add-users-notify';
@Component({
  selector: 'app-ticket-edit-aside',
  templateUrl: './ticket-edit-aside.component.html',
  styleUrls: ['./ticket-edit-aside.component.scss'],
  providers: [TicketsListService, TicketsPermissionsService]

})
export class TicketEditAsideComponent implements OnInit, OnDestroy {

  @ViewChild('updateForm') updateForm: TicketProfileFormUpdateComponent;
  @ViewChild('editUpdateForm') editUpdateForm: TicketProfileEditFormUpdateComponent;
  @ViewChild('rightPanel') rightPanel: TicketEditAsideRightPanelComponent;
  @ViewChild('ticketMessage') ticketMessage: TicketMessageComponent;

  ticketProfile: TicketProfile = new TicketProfile();
  opened = false;
  openedMobileUpdate = false;
  openedMobileEditUpdate = false;
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
    public cd: ChangeDetectorRef,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    private modalService: NgbModal,
    public appService: AppService,
    private devicesStateService: DevicesStateService,
    private addUsersNotifyStateService: AddUsersNotifyStateService,
    private companiesStateService: CompaniesStateService) { }


  ngOnInit() {
    this.ticketsStateService.getOnOpenTicket().subscribe(data => {
      this.showPreloader = true;
    })
    let getOnEditTicket = this.ticketsStateService.getOnEditTicket().subscribe(data => {
      this.ticketStateService.unsubscribeTicket();
      if (this.updateForm) this.updateForm.reset();
      this.ticketProfile = data;
      this.elRef.nativeElement.querySelector("#ticket-note").innerHTML = (this.ticketProfile.note) ? this.ticketProfile.note : "";
      this.updateListAssignedUser();
      this.updateLisUpdateUser();
      this.opened = true;
      this.showPreloader = false;
      this.ticketStateService.getServicesList(this.ticketProfile);
      this.ticketStateService.subsribeToTicket(this.ticketProfile.id);
      this.ticketMessage.reset();

      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
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
    this.sub.add(getConfirm);
    this.ticketsStateService.getOnUpdateTicket().subscribe(data => {

      if (this.opened) {
        let ticket = new Ticket(data);
        if (this.ticketProfile.id === ticket.id) {
          this.ticketProfile.update(data);
          this.elRef.nativeElement.querySelector("#ticket-note").innerHTML = this.ticketProfile.note;
          this.updateListAssignedUser();
          this.updateLisUpdateUser();
        }
        this.cd.detectChanges();
      }
    })

    this.ticketsStateService.getOnRemoveTicket().subscribe(data => {
      if (this.opened) {
        if (this.ticketProfile.id === data.id) this.close();
      }
    });
    this.ticketsStateService.getOnChangeFieldTicket().subscribe((data: TicketChangeField) => {
      console.log("data", data);
      if (this.opened) {
        if (this.ticketProfile.id === data.id) {
          if (data.field === "agent.deviceId") {
            console.log("this.devicesStateService.getAllDevices()[this.ticketProfile.company.id]", this.devicesStateService.getAllDevices()[this.ticketProfile.company.id]);
            let device = this.devicesStateService.getAllDevices()[this.ticketProfile.company.id].find(item => item.agentId === data.value || item.id === data.value);
            this.ticketProfile.agent.label = device.label;
          }
          this.ticketProfile[data.field] = data.value;
        }
        this.cd.detectChanges();
      }
    });
    this.ticketStateService.getOnChangeUpdatesTicket().subscribe(newChange => {


      if (newChange.action == 'UPDATE_SAVED' || newChange.action == 'UPDATE_CREATED' || newChange.action === 'UPDATE_EXPENSE_DELETED') {
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
    let onChangeAssignedUser = this.addUsersNotifyStateService.onChangeAssignedUser.subscribe(data => {
      if (!this.opened || this.addUsersNotifyStateService.getAction() !== USERS_TO_EDIT_TICKET) return;
      this.onSelectAssignedUser(data);
      if (this.listAssignedUser.length > 0 && !this.checkAssignedUser()) {
        let ids = this.listAssignedUser.map(item => {
          return item.id;
        })
        this.ticketsService.addAssignUsers(this.ticketProfile.id, ids).subscribe(data => {

        })
      }
    })
    this.sub.add(onChangeAssignedUser);
    this.ticketStateService.onSetTabUpdate.subscribe(data => {
      this.openedMobileUpdate = (data !== null);
    })
    this.ticketStateService.onEditUpdate.subscribe(data => {
      this.openedMobileEditUpdate = true;
    })
  }
  showDetailUser() {
    if (this.appService.checkMobile()) return;
    let user = this.usersStateService.getAllUsers().find(item => item.id === this.ticketProfile.createdUser.id);
    this.usersStateService.showDetailUser(user);
    (<any>document.body.querySelector(".ticket-edit-aside")).style.zIndex = "1";
    //  (<any>document.body.querySelector(".user-aside-detail-page__aside")).style.zIndex = "3";

  }
  showModalAddUpdate() {
    console.log("showModalAddUpdate");
    const modalRef = this.modalService.open(ModalAddUpdateTicketComponent, { windowClass: 'modal-ticket-profile-form-update' });
    console.log("modalRef", modalRef);
  }
  checkExistServicesProducts() {
    return this.ticketProfile.updates.filter(item => item.type == 'PRODUCT' || item.type == 'SERVICE').length > 0;
  }
  onOpenCompaniesDropDown() {
    this.cd.detectChanges();
  }
  getCompany(id) {
    return this.companiesStateService.getCompanies().find(item => item.id === id);
  }
  changeTicketCompany(id) {
    this.ticketsService.changeSubjectNoteTicket(this.ticketProfile.id, this.ticketProfile.subject, this.ticketProfile.note, id).subscribe(data => {
    })
  }
  private updateListAssignedUser() {
    this.listAssignedUser = [];
    if (this.ticketProfile.assignedUser) this.listAssignedUser.push(this.ticketProfile.assignedUser);
    if (this.ticketProfile.multiAssignedUsers) this.listAssignedUser = [...this.listAssignedUser, ...this.ticketProfile.multiAssignedUsers];
  }
  private updateLisUpdateUser() {
    this.lisUpdateUser = [];
    this.lisUpdateUser = this.ticketProfile.updates.map(item => item.user);
    this.lisUpdateUser = [...this.listAssignedUser, ...this.lisUpdateUser]
    this.lisUpdateUser = this.lisUpdateUser.filter((item, index) => this.lisUpdateUser.findIndex(user => user.id === item.id) === index);
    if (this.ticketProfile.createdUser) {
      let find = this.lisUpdateUser.find(item => item.id === this.ticketProfile.createdUser.id);
      if (!find) this.lisUpdateUser.unshift(this.ticketProfile.createdUser);
    }
  }
  onMoveIntoSpam() {
    if (this.usersStateService.getCurrentUser().isOwner) {
      this.ticketsService.markAsSpamTicket(this.ticketProfile.id, false).subscribe(data => {
      });
    } else {
      this.ticketsService.reportAsSpamTicket(this.ticketProfile.id, false).subscribe(data => {
      });
    }
  }
  moveToTrash(data) {
    this.ticketsService.trashTicket(this.ticketProfile.id, data).subscribe(res => {
      if (data) {
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
  updateAndCloseMobile() {
    console.log("updateAndCloseMobile");
    this.updateForm.updateAndClose();
  }
  toggleSubject() {
    var textCurrent = this.elRef.nativeElement.querySelector("#ticket-subject").value;
    var textOld = this.ticketProfile.subject;
    this.modeSubject = (this.modeSubject === 'view') ? 'edit' : 'view';
    if (this.modeSubject === 'view' && textCurrent != textOld) {
      this.ticketProfile.subject = textCurrent;
      this.onChangeSubjectNote();
    }
  }
  toggleNote() {
    var textCurrent = this.elRef.nativeElement.querySelector("#ticket-note").innerHTML.replace(/<\/?[^>]+>/ig, "");
    var textOld = (this.ticketProfile.note) ? this.ticketProfile.note.replace(/<\/?[^>]+>/ig, "") : "";
    this.modeDescription = 'view';
    if (textCurrent != textOld) {
      this.ticketProfile.note = this.elRef.nativeElement.querySelector("#ticket-note").innerHTML;
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
        return;
      }
      this.ticketMessage.isMarkAsOpen = false;
      this.toastrService.success("The ticket has been successfully changed");
      this.appStateService.changeDetectorRef();
    })
  };
  onDeleteForever() {
    this.ticketsService.deleteTicket([this.ticketProfile.id]).subscribe(data => {
    })
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  onSelectAssignedUser(data) {
    this.listAssignedUser = data;
  }
  onToggleAddAssignedUser() {
    console.log("this.appService.checkMobile()", this.appService.checkMobile());
    if (this.appService.checkMobile()) {
      console.log("this.appService.checkMobile()", this.appService.checkMobile());
      const modalRef = this.modalService.open(ModalAddUsersNotifyComponent, { windowClass: 'quote-send-modal-users-to-notify' });
      modalRef.componentInstance.userList = this.getUsersForAssign();
      modalRef.componentInstance.selectedUsers = this.listAssignedUser;
      this.addUsersNotifyStateService.setAction(USERS_TO_EDIT_TICKET);
      return;
    }
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
      // this.ticketMessage.isClaimTicket = false;
    })

  };
  getCompanyName() {
    if (!this.ticketProfile.company) return '';
    let find = this.companiesStateService.getCompanies().find(item => item.id === this.ticketProfile.company.id);
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
    if (!this.ticketProfile.agent || !this.ticketProfile.agent.label) return '';
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
    this.ticketMessage.reset();
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
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
