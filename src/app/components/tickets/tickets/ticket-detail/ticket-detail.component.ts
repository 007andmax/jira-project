import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { USERS_TO_EDIT_TICKET } from 'src/app/const/add-users-notify';
import { DELETE_FOREVER, MOVE_TO_SPAM_OR_REPORT_TICKET, REBOOT_DEVICE, REMOVE_DEVICES, SHUTDOWN_DEVICE } from 'src/app/const/confirm';
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
import * as moment from "moment";
import { TicketDetailProfileUpdatesComponent } from './ticket-detail-profile-updates/ticket-detail-profile-updates.component';
import { TicketDetailTasksComponent } from './ticket-detail-tasks/ticket-detail-tasks.component';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { TicketProfileUpdate } from '../class/ticket-profile-update';
import { DatePickerStateService } from 'src/app/components/shared/date-picker/services/date-picker-state.service';
import { TicketDetailHeaderComponent } from './ticket-detail-header/ticket-detail-header.component';
import { TicketProfileAgent } from '../class/ticket-profile-agent';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { TicketDetailMessageComponent } from './ticket-detail-message/ticket-detail-message.component';
import { TicketDetailChangeStatusComponent } from './ticket-detail-change-status/ticket-detail-change-status.component';
import { CompanyUsersDropDownComponent } from '../ticket-add-aside/company-users-drop-down/company-users-drop-down.component';
import { TicketDetailChangeCompanyComponent } from './ticket-detail-change-company/ticket-detail-change-company.component';
import { TicketDetailTicketsComponent } from './ticket-detail-tickets/ticket-detail-tickets.component';
import { TicketDetailContactDetailsComponent } from './ticket-detail-contact-details/ticket-detail-contact-details.component';
import { TicketDetailPasswordsDetailsComponent } from './ticket-detail-passwords/ticket-detail-passwords-details/ticket-detail-passwords-details.component';
import { TicketDetailDocumentsDetailsComponent } from './ticket-detail-documents/ticket-detail-documents-details/ticket-detail-documents-details.component';
import { TicketDetailTicketsDetailsComponent } from './ticket-detail-tickets/ticket-detail-tickets-details/ticket-detail-tickets-details.component';
import { TicketDetailEditTagsComponent } from './ticket-detail-edit-tags/ticket-detail-edit-tags.component';

@Component({
  selector: 'ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
  providers: [TicketsListService, TicketsPermissionsService]

})
export class TicketDetailComponent implements OnInit, OnDestroy {
  @ViewChild('ticketMessage') ticketMessage: TicketDetailMessageComponent;
  @ViewChild('ticketProfileUpdates') ticketProfileUpdates: TicketDetailProfileUpdatesComponent;
  @ViewChild('ticketTasks') ticketTasks: TicketDetailTasksComponent;
  @ViewChild('detailHeader') detailHeader: TicketDetailHeaderComponent;
  @ViewChild('changeStatus') changeStatus: TicketDetailChangeStatusComponent;
  @ViewChild('userDP') userDP: CompanyUsersDropDownComponent;
  @ViewChild('changeCompany') changeCompany: TicketDetailChangeCompanyComponent;
  @ViewChild('ticketsDetail') ticketsDetail: TicketDetailTicketsComponent;
  @ViewChild('contactDetail') contactDetail: TicketDetailContactDetailsComponent;
  @ViewChild('passwordRecordDetail') passwordRecordDetail: TicketDetailPasswordsDetailsComponent;
  @ViewChild('documentsRecordDetail') documentsRecordDetail: TicketDetailDocumentsDetailsComponent;
  @ViewChild('ticketsDetailList') ticketsDetailList: TicketDetailTicketsDetailsComponent;
  @ViewChild('ticketTags') ticketTags: TicketDetailEditTagsComponent;
  isInit: boolean = false;
  ticketProfile: TicketProfile = new TicketProfile();
  showFormUpdate: boolean = false;
  showEditUpdate: boolean = false;
  toggleRigthPanel: boolean = true;
  toggleRigthPanelContainer: boolean = true;
  tabFormUpdate: string;
  modeSubject = 'view';
  modeDescription = 'view';
  showAddAssignedUser = false;
  showPreloader: boolean = true;
  typeRigthDetailAside: string;
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
    public ticketStateService: TicketStateService,
    public ticketsPermissionsService: TicketsPermissionsService,
    public cd: ChangeDetectorRef,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    public appService: AppService,
    private router: Router,
    private permissionsService: PermissionsService,
    private devicesStateService: DevicesStateService,
    private addUsersNotifyStateService: AddUsersNotifyStateService,
    public activateRoute: ActivatedRoute,
    public websocketService: WebsocketService,
    private devicesService: DevicesService,
    private datePickerStateService: DatePickerStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private companiesStateService: CompaniesStateService) { }


  ngOnInit() {
    (<any>document.body.querySelector(".nav-header")).style.display = "none";
    document.body.querySelector(".main-container").classList.add("main-container__ticket-detail-page");
    if (this.activateRoute.snapshot.params['id'] && !this.isInit) this.getTicket(this.activateRoute.snapshot.params['id']);
    let subscription = this.activateRoute.params.subscribe(params => {
      if (params['id'] && !this.isInit) this.getTicket(this.activateRoute.snapshot.params['id']);
    });
    this.sub.add(subscription);
    this.listColors = this.ticketsStateService.getListStatusColor();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_FOREVER) {
          this.onDeleteForever();
        }
        if (this.confirmStateService.getConfirmAction() === MOVE_TO_SPAM_OR_REPORT_TICKET) {
          this.onMoveIntoSpam();
        }
        if (this.confirmStateService.getConfirmAction() === REBOOT_DEVICE) {
          this.devicesService.sendPowerAction(this.ticketProfile.company.id, this.devicesStateService.getDevicesForReboot().map(item => item.agentId), 'reboot').subscribe(data => {
          });
        }
        if (this.confirmStateService.getConfirmAction() === SHUTDOWN_DEVICE) {
          this.devicesService.sendPowerAction(this.ticketProfile.company.id, this.devicesStateService.getDevicesForShutDown().map(item => item.agentId), 'shutdown').subscribe(data => {
          });
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_DEVICES) {
          if (this.devicesStateService.getDevicesForRemove().filter(item => item.isCustom).length > 0) this.removeCustomDevice(this.devicesStateService.getDevicesForRemove().filter(item => item.isCustom).map(item => item.id));
          if (this.devicesStateService.getDevicesForRemove().filter(item => !item.isCustom).length > 0) this.devicesService.sendUninstallAgentRequest(this.ticketProfile.company.id, this.devicesStateService.getDevicesForRemove().map(item => item.id)).subscribe(data => {

          });
        }
      }
    });
    this.sub.add(getConfirm);
    let onGetUsers = this.usersStateService.onGetUsers.subscribe(data => {
      if (this.ticketProfile.createdUser) {
        let user = this.usersStateService.getAllUsers().find(item => item.id === this.ticketProfile.createdUser.id);
        if (user) this.ticketProfile.setSelectedCustomerCompany(user.customerCompaniesInfo.find(item => item.companyId == this.ticketProfile.companyId));
      }
    })
    this.sub.add(onGetUsers);
    let getOnUpdateTicket = this.ticketsStateService.getOnUpdateTicket().subscribe(data => {
      let ticket = new Ticket(data);
      let isChangeCompany = data.companyId != this.ticketProfile.companyId;
      let isChangeUser = data.createdUser && data.createdUser.id != this.ticketProfile.createdUser.id;
      if (this.ticketProfile.id === ticket.id) {
        this.ticketProfile.update(data);
        this.elRef.nativeElement.querySelector("#ticket-note").innerHTML = this.ticketProfile.note;
        this.updateListAssignedUser();
        this.updateLisUpdateUser();
        this.ticketTags.setSelectedTags(ticket.tags);
        this.changeCompany.selectItemWithOutChanges(this.companiesStateService.getCompanies().find(item => item.id == this.ticketProfile.companyId));
        if (isChangeCompany && this.ticketProfile.createdUser && !this.customerPortalStateService.isCustomerPortal) this.ticketStateService.getPasswordsDocuments(this.ticketProfile.createdUser.id);
        if (isChangeUser && !this.customerPortalStateService.isCustomerPortal) this.ticketStateService.getDevicesByCompany(this.ticketProfile.company.id);
        if (isChangeCompany) {
          if (this.ticketsDetail) this.ticketsDetail.initDefaultTicketsList();
          if (this.contactDetail) this.contactDetail.resetCompany();
          if (this.passwordRecordDetail) this.passwordRecordDetail.initDefaultPasswordRecordList();
          if (this.documentsRecordDetail) this.documentsRecordDetail.initDefaultPasswordRecordList();
          if (this.ticketsDetailList) this.ticketsDetailList.initDefaultTicketsList();
          this.ticketStateService.getServicesList(this.ticketProfile);
          let user = this.usersStateService.getAllUsers().find(item => item.id === this.ticketProfile.createdUser.id);
          if (user) this.ticketProfile.setSelectedCustomerCompany(user.customerCompaniesInfo.find(item => item.companyId == this.ticketProfile.companyId));
        }

      }
      this.cd.detectChanges();
    })
    this.sub.add(getOnUpdateTicket);
    let getOnChangeFieldTicket = this.ticketsStateService.getOnChangeFieldTicket().subscribe((data: TicketChangeField) => {
      if (this.ticketProfile.id === data.id) {
        if (data.field === "agent.deviceId") this.setAgent(data);
      }
      this.cd.detectChanges();
    });
    this.sub.add(getOnChangeFieldTicket);
    let onRemoveUpdate = this.ticketStateService.onRemoveUpdate.subscribe(res => {
      this.ticketProfile.removeUpdate(res);
    })
    this.sub.add(onRemoveUpdate);
    let onEditUpdate = this.ticketStateService.onEditUpdate.subscribe(newChange => {
      let update = this.ticketProfile.updates.find(item => item.id === newChange.id),
        attachments = newChange.attachments;
      if (update) {
        this.ticketProfile.setUpdate(newChange);
      } else {
        this.ticketProfile.addUpdate(newChange);
      }
      this.detailHeader.resetClosedBtn();
      if (attachments && attachments.length) {
        for (var i = 0; i < attachments.length; i++) {
          this.ticketProfile.addAttachment(attachments[i]);
        }
      }
      this.cd.detectChanges();
      this.datePickerStateService.onInitReset();
    })
    this.sub.add(onEditUpdate);
    let getOnChangeUpdatesTicket = this.ticketStateService.getOnChangeUpdatesTicket().subscribe(newChange => {
      if (newChange.action == 'UPDATE_SAVED' || newChange.action == 'UPDATE_CREATED' || newChange.action === 'UPDATE_EXPENSE_DELETED') {
        let update = this.ticketProfile.updates.find(item => item.id === newChange.data.id),
          attachments = newChange.data.attachments;
        if (update) {
          this.ticketProfile.setUpdate(newChange.data);
        } else {
          this.ticketProfile.addUpdate(newChange.data);
        }
        this.detailHeader.resetClosedBtn();
        if (attachments && attachments.length) {
          for (var i = 0; i < attachments.length; i++) {
            this.ticketProfile.addAttachment(attachments[i]);
          }
        }
        this.cd.detectChanges();
        this.datePickerStateService.onInitReset();
      }
      if (newChange.action == 'UPDATE_DELETED') this.ticketProfile.removeUpdate(newChange.data);
      this.cd.detectChanges();
    });
    this.sub.add(getOnChangeUpdatesTicket);
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
    let onEditUpdateByForm = this.ticketStateService.onEditUpdateByForm.subscribe(data => {
      this.showEditUpdate = true;
    })
    this.sub.add(onEditUpdateByForm);
    let onCloseTicket = this.ticketStateService.onCloseTicket.subscribe(data => {
      this.ticketProfile.setStatus("COMPLETED");
      this.changeStatus.setStatusWithoutChange("COMPLETED");
      this.cd.detectChanges();
    })
    this.sub.add(onCloseTicket);
    let onOpenTicket = this.ticketStateService.onOpenTicket.subscribe(data => {
      this.ticketProfile.setStatus("IN_PROGRESS");
      this.changeStatus.setStatusWithoutChange("IN_PROGRESS");
      this.cd.detectChanges();
    })
    this.sub.add(onOpenTicket);
  }
  removeCustomDevice(ids) {
    forkJoin(
      [...ids.map(item => this.devicesService.deleteCustomDevice(item))]
    )
      .subscribe(res => {

      });
  }
  onSelectUser(selectedUser, customerCompany) {
    this.ticketsService.changeSubjectNoteTicket(this.ticketProfile.id, this.ticketProfile.subject, this.ticketProfile.note, customerCompany.companyId == this.ticketProfile.companyId ? null : customerCompany.companyId, selectedUser.id).subscribe(data => {
    })
  }
  isDisabledTicketCreator() {
    return this.ticketProfile.updates.some(item => item.type == "PRODUCT" || item.type == "SERVICE");
  }
  setAgent(data: TicketChangeField) {
    let device = this.ticketStateService.getDevices().find(item => item.agentId === data.value || item.id === data.value);
    if (device) this.ticketProfile.agent = new TicketProfileAgent(device);
    if (!device) this.ticketProfile.agent = null;
  }
  onViewDocument(data) {
    this.ticketStateService.setDocumentForPreview(data);
    this.typeRigthDetailAside = 'DOCUMENT_PREVIEW';
  }
  onViewDocumentsPreview(data) {
    this.ticketStateService.setDocumentForPreview(data);
  }
  onShowMore(data) {
    this.typeRigthDetailAside = data;
    this.toggleRigthPanel = false;
  }
  onInitRealTimes() {
    if (this.websocketService.isInit) {
      this.ticketStateService.subsribeToTicket(this.ticketProfile.id);
      if (!this.customerPortalStateService.isCustomerPortal) this.ticketStateService.subsribeToTicketTasks(this.ticketProfile.id);
    }
    let onInit = this.websocketService.onInit.subscribe(data => {
      this.ticketStateService.subsribeToTicket(this.ticketProfile.id);
      if (!this.customerPortalStateService.isCustomerPortal) this.ticketStateService.subsribeToTicketTasks(this.ticketProfile.id);
    })
    this.sub.add(onInit);
  }
  onMoveToTrash(data) {
    this.ticketsService.trashTicket(this.ticketProfile.id, data).subscribe(res => {
    })
  }
  restoreFromSpam() {
    this.ticketsService.restoreFromSpam(this.ticketProfile.id, false).subscribe(data => {

    })
  }
  openDetailRigthPanel(data) {
    this.typeRigthDetailAside = data;
    this.toggleRigthPanel = false;
  }
  onCloseDetails() {
    this.typeRigthDetailAside = null;
    this.toggleRigthPanel = true;
  }
  onToggleRigthPanel(data) {
    this.toggleRigthPanelContainer = !this.toggleRigthPanelContainer;
  }
  markAsOpen() {
    this.ticketsService.changeStatus(this.ticketProfile.id, 'IN_PROGRESS').subscribe((data: any) => {
      if (data.code == 403) {
        var user = this.usersStateService.getAllUsers().find(item => item.id === data.message);
        return;
      }
      this.toastrService.success(`The tickets “${this.ticketProfile.number}” status has been changed`);
      this.appStateService.changeDetectorRef();
      this.ticketMessage.isMarkAsOpen = false;
      this.ticketStateService.fastOpenTicket();
    })
  };
  onAddUpdate(data) {
    this.tabFormUpdate = data;
    this.showFormUpdate = true;
    this.ticketStateService.setTabUpdate(data);
  }
  getTicket(id) {
    this.isInit = true;
    this.ticketsService.getTicket(id).subscribe(data => {
      // data.setUserCompanies(ticket.userCompanies);
      this.ticketProfile = data;
      this.elRef.nativeElement.querySelector("#ticket-note").innerHTML = (this.ticketProfile.note) ? this.ticketProfile.note : "";
      this.updateListAssignedUser();
      this.updateLisUpdateUser();
      this.showPreloader = false;
      this.ticketStateService.getServicesList(this.ticketProfile);
      if (this.ticketProfile.createdUser && !this.customerPortalStateService.isCustomerPortal) this.ticketStateService.getPasswordsDocuments(this.ticketProfile.createdUser.id);
      if (!this.customerPortalStateService.isCustomerPortal) this.ticketStateService.getDevicesByCompany(this.ticketProfile.company.id);
      if (this.ticketMessage) this.ticketMessage.reset();
      this.ticketProfileUpdates.resetShowLoadMoreUpdates();
      if (this.ticketTasks) this.ticketTasks.getTicketTasks(id);
      let user = this.usersStateService.getAllUsers().find(item => item.id === this.ticketProfile.createdUser.id);
      if (user) this.ticketProfile.setSelectedCustomerCompany(user.customerCompaniesInfo.find(item => item.companyId == this.ticketProfile.companyId));
      this.onInitRealTimes();
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
  }
  onSelectAssignedUser(data) {
    this.listAssignedUser = data;
    if (this.listAssignedUser.length > 0 && !this.checkAssignedUser()) {
      let ids = this.listAssignedUser.map(item => {
        return item.id;
      })
      this.ticketsService.addAssignUsers(this.ticketProfile.id, ids).subscribe(data => {

      })
    }
  }
  onChangeTags(data, remove) {
    let textNotification = (remove == true) ? "The tag has been successfully removed" : "The tag has been successfully added";
    this.ticketProfile.tags = data;
    let tags = this.ticketProfile.tags.map(item => {
      return {
        id: item.id,
        word: item.word,
        colorCode: 0,
        usedCounter: item.usedCounter,
      }
    })
    this.ticketsService.addTags(this.ticketProfile.id, tags, textNotification).subscribe(res => {

    })
  }
  onDeleteForever() {
    this.ticketsService.deleteTicket([this.ticketProfile.id]).subscribe(data => {
      this.ticketsStateService.onChangeTypeFilter(this.usersStateService.getCurrentUser().startPage == "MY_TICKETS" ? "USERS" : this.usersStateService.getCurrentUser().startPage);
      this.ticketsStateService.onChangeLeftPanelFilter(this.usersStateService.getCurrentUser().startPage == "MY_TICKETS" ? "USERS" : this.usersStateService.getCurrentUser().startPage);
      this.leftPanelStateService.goToState('new-tickets');
      this.leftPanelStateService.toggleLeftPanel(false);
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
    if (!this.ticketsPermissionsService.isActionVisible('update', this.ticketProfile, null, null)) return;
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
  getNameCreateUser() {
    if (!this.ticketProfile.createdUser) return '';
    return `${this.ticketProfile.createdUser.firstName} ${this.ticketProfile.createdUser.lastName}`
  }
  showDetailUser() {
    let user = this.usersStateService.getAllUsers().find(item => item.id === this.ticketProfile.createdUser.id);
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/users/`, user.id]);
    this.leftPanelStateService.toggleLeftPanel(false);
  }
  parseTicketSource() {
    if (this.ticketProfile.deviceId && this.ticketProfile.sourceName == null && this.ticketProfile.ticketSource == "FROM_AGENT") {
      var words = this.ticketProfile.ticketSource.split('_'),
        result = '';
      for (var i = 0, len = words.length; i < len; i++) {
        var word = words[i];
        result += word[0].toLowerCase() + word.slice(1).toLowerCase();
        if (i !== len - 1) {
          result += ' ';
        }
      }
      return `${result} ${this.ticketProfile.deviceId} (new agents stuff)`
    }
    if (this.ticketProfile.deviceId && this.ticketProfile.sourceName && this.ticketProfile.ticketSource == "FROM_AGENT") {
      var words = this.ticketProfile.ticketSource.split('_'),
        result = '';
      for (var i = 0, len = words.length; i < len; i++) {
        var word = words[i];
        result += word[0].toLowerCase() + word.slice(1).toLowerCase();
        if (i !== len - 1) {
          result += ' ';
        }
      }
      return `${result} ${this.ticketProfile.sourceName}`
    }
    if (!this.ticketProfile.ticketSource) {
      return '';
    }
    var words = this.ticketProfile.ticketSource.split('_'),
      result = '';
    for (var i = 0, len = words.length; i < len; i++) {
      var word = words[i];
      result += word[0].toLowerCase() + word.slice(1).toLowerCase();
      if (i !== len - 1) {
        result += ' ';
      }
    }
    return result;
  };
  getAgentName() {
    if (!this.ticketProfile.agent || !this.ticketProfile.agent.label) return '';
    return ` - ${this.ticketProfile.agent.label}`;
  }
  getCreatAt() {
    let date = new Date(this.ticketProfile.createdAt);
    return `${moment(new Date(date)).format('DD MMM YYYY')} at ${moment(new Date(date)).format('hh:mm A')}`;
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
    this.lisUpdateUser = this.ticketProfile.updates.filter(item => item.user).map(item => item.user);
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

  goToCompanyDashboard() {
    if (!this.getPermissions('VIEW_COMPANIES')) return;
    this.companiesStateService.setCompanyRoutingId(this.ticketProfile.company.id);
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/company/`, this.ticketProfile.company.id, 'dashboard']);
    this.leftPanelStateService.toggleLeftPanel(false);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  checkArchivedUser() {
    return (this.ticketProfile.createdUser) ? this.usersStateService.getAllUsers().length > 0 && !this.usersStateService.getAllUsers().find(user => user.id === this.ticketProfile.createdUser.id) : false;
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
    return `priority-icon ticket-edit-aside__ticket-subject-flag ${(this.ticketProfile.priorityLevel && this.ticketProfile.priorityLevel.name !== "MEDIUM") ? '--' + this.ticketProfile.priorityLevel.name.toLowerCase() : ''}`;
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
      this.ticketProfile.setAssignedUser(this.usersStateService.getCurrentUser());
      this.ticketProfile.setAssignedUserId(this.usersStateService.getCurrentUser().id);
      this.ticketProfile.setAssignedAt(new Date().getTime());
      this.ticketStateService.fastOpenTicket();
      this.cd.detectChanges();
    })

  };
  onFetchUpdates(resp) {
    let updates = this.ticketProfile.updates || [];
    updates = [...updates, ...resp.map(item => {
      return new TicketProfileUpdate(item);
    })];
    this.ticketProfile.updates = updates;
    this.cd.detectChanges();
  }
  ngOnDestroy(): void {
    document.body.querySelector(".main-container").classList.remove("main-container__ticket-detail-page");
    this.ticketProfile = new TicketProfile();
    this.modeSubject = 'view';
    this.modeDescription = 'view';
    this.showAddAssignedUser = false;
    this.showPreloader = true;
    this.listAssignedUser = [];
    this.ticketStateService.unsubscribeTicket();
    this.ticketStateService.onTicketClosed();
    this.ticketProfileUpdates.resetShowLoadMoreUpdates();
    this.ticketStateService.sub.unsubscribe();
    (<any>document.body.querySelector(".nav-header")).style.display = "flex";
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
    this.sub.unsubscribe();
  }
}
