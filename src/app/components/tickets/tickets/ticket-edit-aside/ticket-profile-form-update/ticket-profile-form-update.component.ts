import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TicketProfileFormUpdate } from '../class/ticket-profile-form-update';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketsListService } from '../../services/tickets-list.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketProfileFormUpdateProductsComponent } from './ticket-profile-form-update-products/ticket-profile-form-update-products.component';
import { TicketProfileFormUpdateServicesComponent } from './ticket-profile-form-update-services/ticket-profile-form-update-services.component';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn.directive';
import { RemoteSession } from 'src/app/components/support/class/remote-sessions';
import { SupportService } from 'src/app/services/support/support.service';
import { Subscription } from 'rxjs';
import { SupportStateService } from 'src/app/states/support/support-state.service';
import { DraftEmail } from 'src/app/components/shared/draft-email/class/draft-email';
import { DraftEmailService } from 'src/app/services/draft-email/draft-email.service';
import { DevicesRealTimeService } from 'src/app/states/devices/devices-real-time.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { ConstantsStateService } from 'src/app/states/constants/constants-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { TicketStateService } from '../services/ticket-state.service';
import { CompanyDevicesRemoteAccessComponent } from 'src/app/components/company-devices/company-devices-remote-access/company-devices-remote-access.component';
import { AppService } from 'src/app/states/app/app.service';
import { ModalAddUsersNotifyComponent } from 'src/app/services/modal/modal-add-users-notify/modal-add-users-notify.component';
import { USERS_TO_ADD_UPDATE } from 'src/app/const/add-users-notify';
import { AddUsersNotifyStateService } from 'src/app/services/modal/modal-add-users-notify/state/add-users-notify-state.service';

@Component({
  selector: 'app-ticket-profile-form-update',
  templateUrl: './ticket-profile-form-update.component.html',
  styleUrls: ['./ticket-profile-form-update.component.scss'],
  providers: [TicketsListService]
})

export class TicketProfileFormUpdateComponent implements OnInit, OnDestroy {
  ticketProfile: TicketProfile = new TicketProfile();
  ticketProfileFormUpdate: TicketProfileFormUpdate = new TicketProfileFormUpdate();
  @ViewChild('selectProducts') selectProducts: TicketProfileFormUpdateProductsComponent;
  @ViewChild('update_closeBtn') update_closeBtn: DisabledBtnDirective;
  @ViewChild('updateBtn') updateBtn: DisabledBtnDirective;
  @ViewChild('addMoreMobileBtn') addMoreMobileBtn: DisabledBtnDirective;
  @ViewChild('updateMobileBtn') updateMobileBtn: DisabledBtnDirective;
  @ViewChild('selectServices') selectServices: TicketProfileFormUpdateServicesComponent;
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
  tab: string = "NOTE";
  currentUser: CurrentUser;
  sub: Subscription = new Subscription();
  constructor(public ticketsStateService: TicketsStateService,
    public cd: ChangeDetectorRef,
    public usersStateService: UsersStateService,
    public ticketsService: TicketsService,
    private elRef: ElementRef,
    public modalService: NgbModal,
    private devicesService: DevicesService,
    private supportService: SupportService,
    public supportStateService: SupportStateService,
    public devicesRealTimeService: DevicesRealTimeService,
    public draftEmailService: DraftEmailService,
    private constantsStateService: ConstantsStateService,
    private devicesStateService: DevicesStateService,
    public ticketStateService: TicketStateService,
    public appService: AppService,
    public addUsersNotifyStateService: AddUsersNotifyStateService,
    public ticketsListService: TicketsListService) { }

  ngOnInit() {
    if (this.appService.checkMobile()) this.tab = null;
    this.currentUser = this.usersStateService.getCurrentUser();
    this.supportStateService.getHandleSendMode().subscribe(data => {
      let draftEmail: DraftEmail = new DraftEmail();
      draftEmail.setContent(data.message);
      draftEmail.setSubject(data.subject);
      draftEmail.setRecipients(data.recipients);
      this.draftEmailService.sendMessage(draftEmail).subscribe((data) => {
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      })
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
    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'device-send-modal' });
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
  private addCreatedUser() {
    if (this.ticketProfile.createdUser) {
      let find = this.lisUpdateUser.find(item => item.id === this.ticketProfile.createdUser.id);
      if (!find) this.lisUpdateUser.unshift(this.ticketProfile.createdUser);
    }
  }
  public onChangeChat(event) {
    this.ticketProfileFormUpdate.setChatMessage(event.target.value.replace(/\n/g, '<br/>'));
  }
  public onPastChat(value) {
    this.ticketProfileFormUpdate.setChatMessage(value.replace(/\n/g, '<br/>'));
  }
  public reset() {
    if (this.tab === "NOTE") this.elRef.nativeElement.querySelector("#chat").value = "";
    if (!this.appService.checkMobile()) this.tab = "NOTE";
    this.files = [];
    this.showAddUpdateUser = false;
    this.ticketProfileFormUpdate = new TicketProfileFormUpdate();
  }
  closeMobile() {
    this.ticketStateService.setTabUpdate(null);
  }
  getUsersForUpdate() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    let techusers = userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);
    let clientUsers = userList.filter((item) => item.accountType === "CLIENT" && !item.deletedAt && item.company.id === this.ticketProfile.company.id);
    return [...techusers, ...clientUsers];
  }
  updateMobile() {
    this.isUpdateMobile = true;
    this.update();
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
  onUpdateTicket(data) {
    this.updateBtn.setDisabled(true);
    if (this.appService.checkMobile()) {
      if (this.tab === "PRODUCT") this.selectProducts.initUpdateMobile();
      if (this.tab === "SERVICE") this.selectServices.initUpdateMobile();
    }
    if (this.updateMobileBtn) this.updateMobileBtn.setDisabled(true);
    this.isUpdate = true;
    this.ticketsService.updateTicket(data).subscribe(data => {
      this.isUpdate = false;
      if (this.tab === "NOTE") {
        this.ticketProfileFormUpdate.setChatMessage("");
        this.elRef.nativeElement.querySelector("#chat").value = "";
      } else {
        this.ticketsStateService.onClearFormUpdate();
      }
      this.ticketProfileFormUpdate.clearShares();
      this.files = [];
      this.ticketProfileFormUpdate.clearAttachments();
      this.updateBtn.setDisabled(false);
      if (this.updateMobileBtn) this.updateMobileBtn.setDisabled(false);
      if (this.isUpdateMobile) this.closeMobile();
      if (this.appService.checkMobile()) {
        if (this.tab === "PRODUCT") this.selectProducts.complateUpdateMobile();
        if (this.tab === "SERVICE") this.selectServices.complateUpdateMobile();
      }
      this.isUpdateMobile = false;
    }, err => {
      this.isUpdate = false;
      this.isUpdateMobile = false;
      this.updateBtn.setDisabled(false);
      if (this.updateMobileBtn) this.updateMobileBtn.setDisabled(false);
    })
  }
  updateAndClose() {
    if (!this.checkUpdateAndClose()) return;
    console.log("updateAndClose");
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
        this.elRef.nativeElement.querySelector("#chat").value = "";
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
  }
  onChangeProducts(data) {
    this.ticketProfileFormUpdate.setProducts(data);
  }
  onChangeServices(data) {
    this.ticketProfileFormUpdate.setServices(data);
  }
  onToggleAddUpdateUser() {
    if (this.appService.checkMobile()) {
      console.log("this.appService.checkMobile()", this.appService.checkMobile());
      const modalRef = this.modalService.open(ModalAddUsersNotifyComponent, { windowClass: 'quote-send-modal-users-to-notify' });
      modalRef.componentInstance.userList = this.getUsersForAssign();
      modalRef.componentInstance.selectedUsers = this.usersStateService.getAllUsers().filter(item => this.ticketProfileFormUpdate.shares.find(share => share.user.id === item.id))
      this.addUsersNotifyStateService.setAction(USERS_TO_ADD_UPDATE);
      return;
    }
    this.showAddUpdateUser = !this.showAddUpdateUser;
  }
  getUsersForAssign() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);

  }
  onSelectUpdateUser(data) {
    console.log("data", data);
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
    this.files.splice(index, 1);
    this.ticketProfileFormUpdate.removeFile(index);
  }
  removeSession() {
    this.supportService.deleteRemoteSession([this.remoteSession.id]).subscribe(data => {
      this.remoteSession = null;
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackByIndex(index, item) {
    return index;
  }
}
