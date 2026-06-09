
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { RemoteSession } from 'src/app/components/support/class/remote-sessions';
import { User } from 'src/app/components/users/class/user';
import { USERS_TO_ADD_UPDATE } from 'src/app/const/add-users-notify';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketDetailProfileFormUpdateNoteComponent } from './ticket-detail-profile-form-update-note/ticket-detail-profile-form-update-note.component';
import { TicketDetailProfileFormUpdateProductsComponent } from './ticket-detail-profile-form-update-products/ticket-detail-profile-form-update-products.component';
import { TicketDetailProfileFormUpdateServicesComponent } from './ticket-detail-profile-form-update-services/ticket-detail-profile-form-update-services.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, forkJoin } from 'rxjs';
import { CompanyDevicesRemoteAccessComponent } from 'src/app/components/company-devices/company-devices-remote-access/company-devices-remote-access.component';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { DraftEmailService } from 'src/app/services/draft-email/draft-email.service';
import { AddUsersNotifyStateService } from 'src/app/services/modal/modal-add-users-notify/state/add-users-notify-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { SupportService } from 'src/app/services/support/support.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { AppService } from 'src/app/states/app/app.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { DevicesRealTimeService } from 'src/app/states/devices/devices-real-time.service';
import { SupportStateService } from 'src/app/states/support/support-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsListService } from '../../services/tickets-list.service';
import { TicketProfileFormUpdate } from '../../ticket-edit-aside/class/ticket-profile-form-update';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { TicketProfileFormUpdateNoteListComponent } from '../ticket-profile-form-update-note-list/ticket-profile-form-update-note-list.component';
import { TicketDetailProfileFormUpdateHeaderComponent } from './ticket-detail-profile-form-update-header/ticket-detail-profile-form-update-header.component';
import { PreloaderTicketComponent } from 'src/app/components/shared/preloader-ticket/preloader-ticket.component';
import { TicketDetailProfileFormUpdateSupportComponent } from './ticket-detail-profile-form-update-support/ticket-detail-profile-form-update-support.component';

@Component({
  standalone: true,
  imports: [PreloaderTicketComponent, DisabledBtnDirective, TicketDetailProfileFormUpdateSupportComponent, CommonModule],
  selector: 'ticket-detail-profile-form-update',
  templateUrl: './ticket-detail-profile-form-update.component.html',
  styleUrls: ['./ticket-detail-profile-form-update.component.scss'],
  providers: [TicketsListService],

})
export class TicketDetailProfileFormUpdateComponent implements OnInit, OnDestroy {
  ticketProfile: TicketProfile = new TicketProfile();
  @Input() ticketProfileFormUpdate: TicketProfileFormUpdate = new TicketProfileFormUpdate();
  @ViewChild('updateHeader', { static: false }) updateHeader: TicketDetailProfileFormUpdateHeaderComponent;
  @ViewChild('update_closeBtn', { static: false }) update_closeBtn: DisabledBtnDirective;
  @ViewChild('updateBtn', { static: false }) updateBtn: DisabledBtnDirective;
  @ViewChild('addMoreMobileBtn', { static: false }) addMoreMobileBtn: DisabledBtnDirective;
  @ViewChild('updateMobileBtn', { static: false }) updateMobileBtn: DisabledBtnDirective;
  @ViewChild('noteList', { static: true }) noteList: TicketProfileFormUpdateNoteListComponent;
  @Input() lisUpdateUser: Array<CurrentUser> = [];
  @Input() set ticket(value) {
    this.ticketProfile = value;
    this.ticketProfileFormUpdate.setTicketId(this.ticketProfile.id);
    this.addCreatedUser();
  };
  realSessionId: string;
  companyIdForSupport: string;
  remoteSession: RemoteSession;
  @Output() onClosed = new EventEmitter();
  showAddUpdateUser = false;
  isUpdate: boolean = false;
  isUpdateMobile: boolean = false;
  isUpdateAndClose: boolean = false;
  files: any[] = [];
  @Input() tab: string = "NOTE";
  currentUser: CurrentUser;
  sub: Subscription = new Subscription();
  @ViewChild('selectNote', { static: false }) selectNote: TicketDetailProfileFormUpdateNoteComponent;
  @ViewChild('selectServices', { static: false }) selectServices: TicketDetailProfileFormUpdateServicesComponent;
  @ViewChild('selectProducts', { static: false }) selectProducts: TicketDetailProfileFormUpdateProductsComponent;
  @Output() onCloseForm = new EventEmitter();
  constructor(public ticketsStateService: TicketsStateService,
    public cd: ChangeDetectorRef,
    public usersStateService: UsersStateService,
    public ticketsService: TicketsService,
    public elRef: ElementRef,
    public supportService: SupportService,
    public supportStateService: SupportStateService,
    public devicesRealTimeService: DevicesRealTimeService,
    public draftEmailService: DraftEmailService,
    public ticketStateService: TicketStateService,
    public appService: AppService,
    public companiesService: CompaniesService,
    public permissionsService: PermissionsService,
    public addUsersNotifyStateService: AddUsersNotifyStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public modalService: NgbModal,
    public ticketsListService: TicketsListService) { }
  onSelectedNote(data) {
    // this.elRef.nativeElement.querySelector("#chat").innerHTML = data;
    this.ticketProfileFormUpdate.setChatMessage(data.replace(/\n/g, '<br/>'));
  }
  onConnectRemoteAccess(data) {
    this.companyIdForSupport = data.companyId;
    if (!data.sessionId) {
      throw 'SessionId is required';
    }
    if (!data.conectionType) {
      throw 'conectionType is required';
    }
    this.createRemoteAccess(data.sessionId, data.conectionType);
  }
  createRemoteAccess(realSessionId, connectionType) {
    this.realSessionId = realSessionId;
    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'device-send-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.remoteSessionId = this.realSessionId;
    modalRef.componentInstance.companyId = this.companyIdForSupport;
    modalRef.componentInstance.connectionType = connectionType;
    modalRef.componentInstance.action = 'CONNECT_SUPPORT_DEVICE';
    document.body.click();
    this.cd.detectChanges();
  }
  onCreateOneTimeRemoteSession() {
    this.supportService.createOneTimeRemoteSession().subscribe(data => {
      this.remoteSession = new RemoteSession(data);
      this.cd.detectChanges();
    })
  }
  public addCreatedUser() {
    if (this.ticketProfile.createdUser) {
      let find = this.lisUpdateUser.find(item => item.id === this.ticketProfile.createdUser.id);
      if (!find) this.lisUpdateUser.unshift(this.ticketProfile.createdUser);
    }
  }
  onKeyPress(event) {
    if (event.target.innerHTML.length >= 50000) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  public onChangeChat(event) {
    let value = "";
    if (event.target.innerHTML.length >= 50000) {
      event.preventDefault();
      event.target.innerHTML = event.target.innerHTML.substring(0, 50000);
      value = event.target.innerHTML;
      var range = window.getSelection(); // 创建range
      range.selectAllChildren(event.target); // Range 选择obj下所有子内容
      range.collapseToEnd();
    } else {
      value = event.target.innerHTML;
    }
    this.ticketProfileFormUpdate.setChatMessage(value.replace(/\n/g, '<br/>'));
  }
  public reset() {
    if (this.tab === "NOTE") this.elRef.nativeElement.querySelector("#chat").innerHTML = "";
    this.tab = "NOTE";
    this.files = [];
    this.showAddUpdateUser = false;
    this.ticketProfileFormUpdate = new TicketProfileFormUpdate();
    this.ticketProfileFormUpdate.setTechUser(this.currentUser);
  }
  closeMobile() {
    this.ticketStateService.setTabUpdate(null);
  }
  getUsersForUpdate() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    let techusers = userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);
    let clientUsers = userList.filter((item) => item.accountType === "CLIENT" && !item.deletedAt && item.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.ticketProfile.company.id));
    return [...techusers, ...clientUsers];
  }
  update() {
    if (this.tab === "NOTE") {
      if (!this.ticketProfileFormUpdate.isValidateNote()) return;
      this.onUpdateTicket(this.ticketProfileFormUpdate.getDataForUpdateNote());
    }
    if (this.tab === "PRODUCT") {
      this.onChangeProducts(this.selectProducts.getSelectedProducts());
      if (!this.ticketProfileFormUpdate.isValidateProduct() || !this.selectProducts.onValidateProducts()) return;
      this.onUpdateTicket(this.ticketProfileFormUpdate.getDataForUpdateProduct());
    }
    if (this.tab === "SERVICE") {
      this.onChangeServices(this.selectServices.getSelectedServices());
      if (!this.selectServices.onValidateServices() || !this.ticketProfileFormUpdate.isValidateService()) return;
      this.onUpdateTicket(this.ticketProfileFormUpdate.getDataForUpdateService());
    }
  }

  updateAndClose() {
    if (!this.checkUpdateAndClose()) return;
    if (this.tab === "NOTE") {
      if (this.ticketProfileFormUpdate.isValidateNote()) {
        this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForUpdateNote());
      } else this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForClose());
    }
    if (this.tab === "PRODUCT") {
      this.onChangeProducts(this.selectProducts.getSelectedProducts());
      if (this.ticketProfileFormUpdate.isValidateProduct()) {
        if (!this.selectProducts.onValidateProducts()) return;
        this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForUpdateProduct());
      } else this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForClose());
    }
    if (this.tab === "SERVICE") {
      this.onChangeServices(this.selectServices.getSelectedServices());
      if (this.ticketProfileFormUpdate.isValidateServiceUpdateAndClose()) {
        if (!this.selectServices.onValidateServices()) return;

        this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForUpdateService());
      } else this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForClose());
    }
    if (this.tab == null) this.onUpdateTicketAndClose(this.ticketProfileFormUpdate.getDataForClose());
  }
  onUpdateTicketAndClose(data) {

    this.update_closeBtn.setDisabled(true);
    this.isUpdateAndClose = true;
    this.ticketsService.updateTicket(data, true).subscribe(data => {
      this.isUpdateAndClose = false;
      if (this.tab === "NOTE") {
        this.ticketProfileFormUpdate.setChatMessage("");
        this.elRef.nativeElement.querySelector("#chat").innerHTML = "";
      } else {
        this.ticketsStateService.onClearFormUpdate();
      }
      this.ticketProfileFormUpdate.clearShares();
      this.files = [];
      this.ticketProfileFormUpdate.clearAttachments();
      this.onClosed.emit(null);
      this.update_closeBtn.setDisabled(false);
    }, err => {
      this.isUpdateAndClose = false;
      this.update_closeBtn.setDisabled(false);
    })
  }
  checkUpdateAndClose() {
    if (this.ticketProfile.updates.length === 0) return true;
    let completeServices = true;
    let completeProducts = true;
    this.ticketProfile.updates.forEach(update => {
      if (update.type !== 'MIXED') {
        if (completeServices) completeServices = (update.services.find(item => !item.completed) ? false : true);
        if (completeProducts) completeProducts = (update.products.find(item => !item.completed) ? false : true);
      }
    });
    return completeServices && completeProducts;
  }
  public setTab(data) {
    this.tab = data;

    this.ticketProfileFormUpdate.setType(data);
    this.ticketProfileFormUpdate.clearShares();
    if (this.tab === 'NOTE' && this.noteList && this.ticketProfile.id) this.noteList.onGetNoteList()
    if (this.updateHeader) this.updateHeader.setTab(this.tab);
  }

  onChangeProducts(data) {
    this.ticketProfileFormUpdate.setProducts(data);
  }
  onChangeServices(data) {
    this.ticketProfileFormUpdate.setServices(data);
  }
  onToggleAddUpdateUser() {
    this.showAddUpdateUser = !this.showAddUpdateUser;
  }
  getUsersForAssign() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);

  }
  onSelectUpdateUser(data) {
    this.lisUpdateUser = data;
    this.addCreatedUser();
  }
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }
  uploadFilesSimulator(index: number) {
    if (index === this.files.length) {
      return;
    } else {
      if (this.files[index].size > 4000000) {
        this.files[index].showError = true;
        this.uploadFilesSimulator(index + 1);
        return;
      }
      this.uploadFile(this.files[index]).then((data: any) => {
        let res = JSON.parse(data.response);
        this.ticketProfileFormUpdate.addFile(res.id);
        this.uploadFilesSimulator(index + 1);
        this.cd.detectChanges();
      }).catch(() => {
        this.files[index].showError = true;
        this.uploadFilesSimulator(index + 1);
      });
    }
  }
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      var fd = new FormData();
      fd.append("file", file);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", (event) => {
        resolve(xhr);
      }, false);
      xhr.upload.onprogress = (event) => {
        file.progress = Math.round((event.loaded / event.total) * 100);
      }
      xhr.addEventListener("error", (error) => {
        reject(error);
      }, false);
      xhr.open("POST", "/file?isAvatar=false");
      xhr.send(fd);
    });
  }
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  deleteFile(index: number) {
    this.companiesService.removeAttachment(this.ticketProfileFormUpdate.attachFileIds[index]).subscribe(data => {

    })
    this.files.splice(index, 1);
    this.ticketProfileFormUpdate.removeFile(index);
  }
  removeSession() {
    this.supportService.deleteRemoteSession([this.remoteSession.id]).subscribe(data => {
      this.remoteSession = null;
    })
  }
  removeAllAttachments() {
    if (this.ticketProfileFormUpdate.attachFileIds.length > 0) {
      forkJoin(
        this.ticketProfileFormUpdate.attachFileIds.map(item => this.companiesService.removeAttachment(item))
      ).subscribe(result => {

      });
    }
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }

  public trackByIndex(index, item) {
    return index;
  }

  ngOnInit() {
    if (this.ticketStateService.getTicketProfileFormUpdate()) this.ticketProfileFormUpdate = this.ticketStateService.getTicketProfileFormUpdate();
    this.currentUser = this.usersStateService.getCurrentUser();
    this.ticketProfileFormUpdate.setTechUser(this.currentUser);
    let onGetCurrentUser = this.usersStateService.onGetCurrentUser.subscribe(data => {
      this.currentUser = data;
      this.ticketProfileFormUpdate.setTechUser(this.currentUser);
    })
    this.sub.add(onGetCurrentUser);
    let onSetNoteType = this.ticketStateService.onSetNoteType.subscribe(data => {
      this.ticketProfileFormUpdate.setNoteType(data);
      this.updateHeader.onChangeType(data);
    })
    this.sub.add(onSetNoteType);
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
    if (this.tab === 'NOTE' && this.noteList) this.noteList.onGetNoteList();
    this.ticketProfileFormUpdate.setType(this.tab);
    if (this.tab == "NOTE" && this.customerPortalStateService.isCustomerPortal) this.ticketProfileFormUpdate.setNoteType("PUBLIC");
    if (!this.customerPortalStateService.isCustomerPortal) this.ticketProfileFormUpdate.setNoteType(this.ticketStateService.getNoteType());
    let onCloseModalNote = this.ticketStateService.onCloseModalNote.subscribe(res => {
      this.close();
    })
    this.sub.add(onCloseModalNote);
  }


  public isShowAddUpdate() {
    if (this.tab !== 'QUICK_SUPPORT') {
      return true;
    } else {
      return false;
    }
  }
  onUpdateTicket(data) {
    this.updateBtn.setDisabled(true);
    this.isUpdate = true;
    this.ticketsService.updateTicket(data).subscribe(res => {
      this.ticketStateService.setEditUpdate(res);
      this.isUpdate = false;
      this.updateBtn.setDisabled(false);
      this.close();
    }, err => {
      this.isUpdate = false;
      this.updateBtn.setDisabled(false);
    })
  }
  close() {
    this.ticketStateService.resetTicketProfileFormUpdate();
    this.onCloseForm.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
