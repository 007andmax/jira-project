import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { USERS_TO_EDIT_TICKET } from 'src/app/const/add-users-notify';
import { DELETE_FOREVER, MOVE_TO_SPAM_OR_REPORT_TICKET } from 'src/app/const/confirm';
import { AddUsersNotifyStateService } from 'src/app/services/modal/modal-add-users-notify/state/add-users-notify-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { StatusColor } from '../../class/status-color';
import { Ticket } from '../../class/ticket';
import { TicketChangeField } from '../class/ticket-change-field';
import { TicketProfile } from '../class/ticket-profile';
import { TicketsListService } from '../services/tickets-list.service';
import { TicketStateService } from '../ticket-edit-aside/services/ticket-state.service';
import { TicketsPermissionsService } from '../ticket-edit-aside/services/tickets-permissions.service';
import { TicketEditAsideRightPanelComponent } from '../ticket-edit-aside/ticket-edit-aside-right-panel/ticket-edit-aside-right-panel.component';
import { TicketMessageComponent } from '../ticket-edit-aside/ticket-message/ticket-message.component';
import { TicketProfileEditFormUpdateComponent } from '../ticket-edit-aside/ticket-profile-edit-form-update/ticket-profile-edit-form-update.component';
import { TicketProfileFormUpdateComponent } from '../ticket-edit-aside/ticket-profile-form-update/ticket-profile-form-update.component';
import { TicketProfileUpdatesComponent } from '../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates.component';
import * as moment from "moment";
import { TicketDetailProfileUpdatesComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates.component';

@Component({
  selector: 'ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
  providers: [TicketsListService, TicketsPermissionsService]

})
export class TicketDetailComponent implements OnInit, OnDestroy {
  @ViewChild('updateForm') updateForm: TicketProfileFormUpdateComponent;
  @ViewChild('editUpdateForm') editUpdateForm: TicketProfileEditFormUpdateComponent;
  @ViewChild('rightPanel') rightPanel: TicketEditAsideRightPanelComponent;
  @ViewChild('ticketMessage') ticketMessage: TicketMessageComponent;
  @ViewChild('ticketProfileUpdates') ticketProfileUpdates: TicketDetailProfileUpdatesComponent;

  ticketProfile: TicketProfile = new TicketProfile();
  openedMobileUpdate = false;
  openedMobileEditUpdate = false;
  modeSubject = 'view';
  modeDescription = 'view';
  showAddAssignedUser = false;
  showPreloader: boolean = true;
  listColors: Array<StatusColor> = [];
  listAssignedUser: Array<CurrentUser> = [];
  lisUpdateUser: Array<CurrentUser> = [];
  sub: Subscription = new Subscription();
  constructor(private leftPanelStateService: LeftPanelStateService,
    private ticketsStateService: TicketsStateService,
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
    private router: Router,
    private permissionsService: PermissionsService,
    private devicesStateService: DevicesStateService,
    private addUsersNotifyStateService: AddUsersNotifyStateService,
    public activateRoute: ActivatedRoute,
    private companiesStateService: CompaniesStateService) { }


  ngOnInit() {
    this.getTicket(this.activateRoute.snapshot.params['id']);
    this.listColors = this.ticketsStateService.getListStatusColor();
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
      let ticket = new Ticket(data);
      if (this.ticketProfile.id === ticket.id) {
        this.ticketProfile.update(data);
        this.elRef.nativeElement.querySelector("#ticket-note").innerHTML = this.ticketProfile.note;
        this.updateListAssignedUser();
        this.updateLisUpdateUser();
      }
      this.cd.detectChanges();
    })

    this.ticketsStateService.getOnRemoveTicket().subscribe(data => {

      if (this.ticketProfile.id === data.id) this.close();

    });
    this.ticketsStateService.getOnChangeFieldTicket().subscribe((data: TicketChangeField) => {
      if (this.ticketProfile.id === data.id) {
        if (data.field === "agent.deviceId") {
          let device = this.devicesStateService.getAllDevices()[this.ticketProfile.company.id].find(item => item.agentId === data.value || item.id === data.value);
          this.ticketProfile.agent.label = device.label;
        }
        this.ticketProfile[data.field] = data.value;
      }
      this.cd.detectChanges();

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
      if (this.addUsersNotifyStateService.getAction() !== USERS_TO_EDIT_TICKET) return;
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
  getTicket(id) {
    this.ticketsService.getTicket(id).subscribe(data => {
      // data.setUserCompanies(ticket.userCompanies);
      this.ticketStateService.unsubscribeTicket();
      if (this.updateForm) this.updateForm.reset();
      if (this.updateForm) this.updateForm.noteList.onGetNoteList()
      this.ticketProfile = data;
      this.elRef.nativeElement.querySelector("#ticket-note").innerHTML = (this.ticketProfile.note) ? this.ticketProfile.note : "";
      this.updateListAssignedUser();
      this.updateLisUpdateUser();
      this.showPreloader = false;
      this.ticketStateService.getServicesList(this.ticketProfile);
      this.ticketStateService.subsribeToTicket(this.ticketProfile.id);
      this.ticketMessage.reset();
      this.ticketProfileUpdates.resetShowLoadMoreUpdates();
      if (this.appService.checkMobile()) this.appService.toggleMobileAside(true);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
        if (!this.rightPanel.toggleRightPanel && !this.appService.isMobile) this.rightPanel.toggleTypeOnPanel('COMPANY_INFO');
      }
    })
  }
  onSelectAssignedUser(data) {
    this.listAssignedUser = data;
  }
  ngOnDestroy(): void {
    this.leftPanelStateService.toggleShowBtnLeftPanel(true);
  }
  onDeleteForever() {
    this.ticketsService.deleteTicket([this.ticketProfile.id]).subscribe(data => {
    })
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
  toggleSubject() {
    if (this.appService.checkMobile() || !this.getPermissions('EDIT_TICKETS')) return;
    var textCurrent = this.elRef.nativeElement.querySelector("#ticket-subject").value;
    var textOld = this.ticketProfile.subject;
    this.modeSubject = (this.modeSubject === 'view') ? 'edit' : 'view';
    if (this.modeSubject === 'view' && textCurrent != textOld) {
      this.ticketProfile.subject = textCurrent;
      this.onChangeSubjectNote();
    }
  }
  toggleNote() {
    if (this.appService.checkMobile()) return;
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
  getNameCreateUser() {
    if (!this.ticketProfile.createdUser) return '';
    return `${this.ticketProfile.createdUser.firstName} ${this.ticketProfile.createdUser.lastName}`
  }
  showDetailUser() {
    if (this.appService.checkMobile() || !this.getPermissions('VIEW_USERS')) return;
    let user = this.usersStateService.getAllUsers().find(item => item.id === this.ticketProfile.createdUser.id);
    this.usersStateService.showDetailUser(user);
    (<any>document.body.querySelector(".ticket-edit-aside")).style.zIndex = "1";
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
  getCreatAt() {
    let date = new Date(this.ticketProfile.createdAt);
    let hours = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours();
    let type = (date.getHours() >= 12) ? 'pm' : 'am';
    return `${moment(date).format('DD MMM YYYY')}, ${(hours < 10 ? '0' + hours : hours)}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()} ${type}`
  }
  getCompanyName() {
    if (!this.ticketProfile.company) return '';
    let find = this.companiesStateService.getCompanies().find(item => item.id === this.ticketProfile.company.id);
    return (find) ? find.name : '';
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
  onOpenCompaniesDropDown() {
    this.cd.detectChanges();
  }
  showTooltipCompany(userCompanyTooltip, $event) {
    if (this.ticketProfile.ticketSource === 'FROM_EMAIL' && this.checkExistServicesProducts() && this.getCompany(this.ticketProfile.company.id) && this.getCompany(this.ticketProfile.company.id).isUnknown) userCompanyTooltip.show($event.target)
  }
  goToCompanyDashboard() {
    if (!this.getPermissions('VIEW_COMPANIES') && this.ticketProfile.ticketSource === 'FROM_EMAIL' && !this.checkExistServicesProducts() && this.getCompany(this.ticketProfile.company.id).isUnknown) return;
    this.companiesStateService.setCompanyRoutingId(this.ticketProfile.company.id);
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/company/`, this.ticketProfile.company.id, 'dashboard']);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  checkExistServicesProducts() {
    return this.ticketProfile.updates.filter(item => item.type == 'PRODUCT' || item.type == 'SERVICE').length > 0;
  }
  getClientsList() {
    return this.companiesStateService.getCompanies().filter(item => item.accountType === 'CLIENT' && !item.deletedAt);
  }
  getCompany(id) {
    return this.companiesStateService.getCompanies().find(item => item.id === id);
  }
  getClassType() {
    return `priority-icon ticket-edit-aside__ticket-subject-flag ${(this.ticketProfile.priorityLevel && this.ticketProfile.priorityLevel !== "MEDIUM") ? '--' + this.ticketProfile.priorityLevel.toLowerCase() : ''}`;
  }
  close() {
    if (this.updateForm) this.updateForm.removeAllAttachments();
    this.ticketProfile = new TicketProfile();
    this.modeSubject = 'view';
    this.modeDescription = 'view';
    this.showAddAssignedUser = false;
    this.showPreloader = true;
    this.listAssignedUser = [];
    this.rightPanel.close();
    this.ticketStateService.unsubscribeTicket();
    this.ticketStateService.onTicketClosed();
    this.ticketMessage.reset();
    this.appService.toggleMobileAside(false);
    this.ticketProfileUpdates.resetShowLoadMoreUpdates();
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}
