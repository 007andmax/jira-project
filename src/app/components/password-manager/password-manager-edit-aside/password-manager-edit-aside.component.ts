import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { PasswordRecord } from '../class/password-record';
import { PasswordDeviceUser } from '../class/password-device-user';
import { PasswordRecordValidate } from '../class/password-record-validate';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';
import { REMOVE_RECORD } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { PasswordRecordCategories } from '../class/password-record-categories';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { Subscription } from 'rxjs';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { PasswordRecordHistory } from '../class/password-record-history';
import { PasswordRecordLink } from '../class/password-record-link';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { Device } from '../../company-devices/class/device';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';

/**
 * Password manager edit aside component
 */
@Component({
  selector: 'app-password-manager-edit-aside',
  templateUrl: './password-manager-edit-aside.component.html',
  styleUrls: ['./password-manager-edit-aside.component.scss'],

})
export class PasswordManagerEditAsideComponent implements OnInit, OnDestroy {
  public selectedClient: any;
  public opened: boolean = false;
  showSecretCode: boolean = false;
  isEditSecretKey: boolean = false;
  isGetSecretCode: boolean = false;
  subSecretCode: Subscription;
  showPassword: boolean = false;
  tab: string = 'PASSWORD_DETAIL'
  devices = [];
  categories: Array<PasswordRecordCategories> = [];
  public editItem: PasswordRecord = null;
  timeCount: number = 0;
  intervalContainer: any;
  validate: PasswordRecordValidate = new PasswordRecordValidate();
  selectedUserAndDevices: Array<PasswordDeviceUser> = [];
  @ViewChild('categoriesSelect', { static: false }) categoriesSelect: DropDownComponent;
  public devicesList: Array<PasswordDeviceUser> = [];
  public usersList: Array<PasswordDeviceUser> = [];
  public gadgetsList: Array<PasswordDeviceUser> = [];
  sub: Subscription = new Subscription();
  @ViewChild('saveRecord', { static: false }) saveRecord: DisabledBtnDirective;
  /**
   * Creates an instance of the PasswordManagerEditAsideComponent with the injected services
     * @param {FormBuilder} fb Service to work with form
   * @param {CompaniesService} companiesService Service to work with api
   * @param {DevicesService} devicesService Service to work with api
   * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {userService} userService Service to work with user
   * @param {GadgetsService} gadgetsService Service to work with gadget api
   * @param {permissionsService} permissionsService to work with permissions service
   */
  constructor(
    private passwordManagerService: PasswordManagerService,
    private permissionsService: PermissionsService,
    public cd: ChangeDetectorRef,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private passwordManagerStateService: PasswordManagerStateService,
    private companiesState: CompaniesStateService,
    public usersStateService: UsersStateService,
    private elRef: ElementRef,
    private toastrService: ToastrService,
    public devicesService: DevicesService,
    private appStateService: AppStateService,
    public devicesStateService: DevicesStateService,
  ) { }

  /**
   * Initializes Password manager edit aside. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    if (this.companiesState.isInitLightAllCompanies && this.editItem) this.selectedClient = this.companiesState.getLightCompanies().find(item => item.id === this.editItem.companyId);
    let getOnCompanies = this.companiesState.onLightCompanies.subscribe((data) => {
      if (this.editItem) this.selectedClient = data.find(item => item.id === this.editItem.companyId);
    })
    this.sub.add(getOnCompanies);
    let onEditForm = this.passwordManagerService.onEditForm.subscribe((res) => {
      if (this.subSecretCode) this.subSecretCode.unsubscribe();
      if (this.editItem) this.elRef.nativeElement.querySelector('#record-description').value = JSON.parse(JSON.stringify(res)).description;
      this.editItem = new PasswordRecord(JSON.parse(JSON.stringify(res)));
      this.selectedUserAndDevices = [];
      this.usersList = [];
      this.devicesList = [];
      this.gadgetsList = [];
      this.devices = [];
      this.passwordManagerStateService.setDevices(this.devices)
      if (!this.editItem.otpEnable) this.isEditSecretKey = true;

      this.selectedClient = this.companiesState.getCompanies().find(item => item.id === this.editItem.companyId);
      if (!this.companiesState.isInitLightAllCompanies) this.companiesState.onInitGetLightCompanies();
      this.getDetails();
      this.changeTab('PASSWORD_DETAIL');
      this.opened = true;
      this.showSecretCode = true;
      this.isEditSecretKey = false;
      this.isGetSecretCode = true;
      this.showPassword = false;
      if (this.intervalContainer) clearInterval(this.intervalContainer);
      if (this.showSecretCode && this.editItem.otpEnable) this.getCodeRecords();
    });
    this.sub.add(onEditForm);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_RECORD) {
          this.close();
        }
      }
    })
    this.sub.add(getConfirm);
    this.categories = this.passwordManagerStateService.getCategories();
    let onGetCategories = this.passwordManagerStateService.onGetCategories.subscribe((data: Array<PasswordRecordCategories>) => {
      this.categories = data;
      if (this.categoriesSelect) this.categoriesSelect.reset(this.categories);
    })
    this.sub.add(onGetCategories);
    let onDeviceUninstalled = this.devicesStateService.onChangeDevice.subscribe(newChange => {
      if (this.selectedClient && this.selectedClient.id == newChange.data.clientCompanyId) this.devicesStateService.changeDevice(this.devicesList, newChange);
    })
    this.sub.add(onDeviceUninstalled);
    /* let onChangeRealTime = this.passwordManagerStateService.onChangeRealTime.subscribe(newChange => {
       if (newChange.action === 'PASSWORD_RECORD_UPDATED' && this.editItem && newChange.data.id === this.editItem.id) this.editItem.updateHistories(newChange.data.histories);
       if (!this.cd['destroyed']) this.cd.detectChanges();
     })
     this.sub.add(onChangeRealTime);*/
  }
  getDetails() {
    this.passwordManagerService.getPasswordRecordDetail(this.editItem.id).subscribe((data: any) => {
      this.editItem.updateHistories(data.histories.map(item => new PasswordRecordHistory(item)));
      this.editItem.setLinks(data.links.map(item => new PasswordRecordLink(item)));
      this.editItem.links.forEach(item => {
        if (item.userId) {
          this.selectedUserAndDevices.push(new PasswordDeviceUser(item.userId, `${item.userName}`, 'USER'));
          this.usersList.push(new PasswordDeviceUser(item.userId, `${item.userName}`, 'USER'));
        }
        if (item.deviceId) {
          this.selectedUserAndDevices.push(new PasswordDeviceUser(item.deviceId, `${item.deviceLabel}`, 'DEVICE'));
          this.devicesList.push(new PasswordDeviceUser(item.deviceId, `${item.deviceLabel}`, 'DEVICE'));
        }
        if (item.gadgetId) {
          this.selectedUserAndDevices.push(new PasswordDeviceUser(item.gadgetId, `${item.gadgetName}`, 'GADGET'));
          this.gadgetsList.push(new PasswordDeviceUser(item.gadgetId, `${item.gadgetName}`, 'GADGET'));
        }
      })
    })
  }
  getDevices() {
    if (this.devices.length == 0) {
      this.devicesService.getCompanyDevices(this.selectedClient.id).subscribe((data: any) => {
        this.devices = (data[this.selectedClient.id]) ? JSON.parse(JSON.stringify(data[this.selectedClient.id])).filter(item => !item.isCustom).map(item => new Device(item)) : [];
        this.passwordManagerStateService.setDevices(this.devices);
      });
    } else {
      this.passwordManagerStateService.setDevices(this.devices);
    }
  }
  toggleSecretCode() {
    this.showSecretCode = !this.showSecretCode;
    if (this.intervalContainer) clearInterval(this.intervalContainer);
    if (!this.showSecretCode) this.isGetSecretCode = false;
    if (this.showSecretCode && this.editItem.otpEnable) this.getCodeRecords();
  }
  onChangeAuthenticationKey(event) {
    this.editItem.authenticationKey = event.target.value.toUpperCase();
    this.validate.resetAuthenticationKeyLen();
    this.validate.resetAuthenticationKeyBase32();
    this.editItem.setResetAuthenticationKey(false)
  }
  clearSecretKey() {
    this.editItem.setAuthenticationKey("");
    this.editItem.setResetAuthenticationKey(true);
    this.isEditSecretKey = false;
  }
  changeTab(data) {
    this.tab = data;
    if (this.tab === 'LINKED_DEVICES') this.getDevices();
  }
  getCodeRecords() {
    this.timeCount = 0;
    this.subSecretCode = this.passwordManagerService.getCodeRecords(this.editItem.id).subscribe((data: any) => {
      this.editItem.setOtp(data.otp);
      this.editItem.setExpirationDate(data.expirationDate);
      this.isGetSecretCode = true;
      let timeout = (this.editItem.expirationDate - new Date().getTime()) / 1000;
      if (timeout > 0) {
        this.timeCount = Math.ceil(timeout);
        this.intervalContainer = setInterval(() => {
          this.timeCount = (this.timeCount - 1);
          if (this.timeCount < 0) {
            clearInterval(this.intervalContainer);
            this.getCodeRecords();
          }
          this.cd.detectChanges();
        }, 1000);
      }
    })
  }
  getCodeProgress() {
    return (this.timeCount / 30) * 100;
  }
  editSecretCode() {
    this.isEditSecretKey = !this.isEditSecretKey;
    this.editItem.setAuthenticationKey("");
  }
  getTimeProgress() {
    return `${(this.timeCount >= 10) ? this.timeCount : '0' + this.timeCount}`
  }
  onInitDescription() {
    this.elRef.nativeElement.querySelector('#record-description').value = this.editItem.description;
    this.cd.detectChanges();
  }
  public onChangeDescription(event) {
    this.editItem.description = event.target.value;
  }
  public onPastDescription(value) {
    this.editItem.description = value;
  }
  selectCompany(data) {
    this.selectedClient = data;
    this.editItem.setCompanyId(data.id);
    this.validate.resetCompany();
  }
  selectType(data) {
    this.editItem.setType((data) ? data : new PasswordRecordCategories());
    if (data) this.validate.resetTemplate();
    if (data && data.name !== 'DEVICE' && data.name !== 'LOCAL_USER_ACCOUNT') this.validate.resetLinkTo();
  }
  onChangeExpiryDate(data) {
    this.editItem.setExpiryDate(moment(new Date(data.year, data.month - 1, data.day)).format('YYYY/MM/DD'));
  }
  togglePassword() {
    if (!this.showPassword) {
      this.passwordManagerService.setOpenRecord(this.editItem.id).subscribe((data: any) => {
        this.editItem.setPassword(data.password);
        this.showPassword = true;
      })
    } else {
      this.showPassword = false;
    }
  }
  public getHistoryDate(date) {
    return moment(date).format('DD MMMM, YYYY')
  }
  copyPassword() {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = this.editItem.password;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }
    document.body.removeChild(textArea);
    this.toastrService.success("The value is copied to clipboard");
    this.appStateService.changeDetectorRef();
  }
  copySecretCode() {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = this.editItem.otp;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }
    document.body.removeChild(textArea);
    this.toastrService.success("The value is copied to clipboard");
    this.appStateService.changeDetectorRef();
  }
  public save() {
    this.selectedUserAndDevices = [...this.usersList, ...this.devicesList, ...this.gadgetsList];
    if (!this.validate.isValidateEdit(this.editItem, this.selectedUserAndDevices)) return;
    this.saveRecord.setDisabled(true);
    this.passwordManagerService.editRecord(this.editItem.getDataForEdit(this.selectedUserAndDevices))
      .subscribe((res) => {
        this.passwordManagerStateService.onChangeRealTime.next({ action: "PASSWORD_RECORD_UPDATED", data: res });
        this.passwordManagerStateService.changePassword(this.editItem);
        this.saveRecord.setDisabled(false);
        this.close();
      }, err => {
        this.saveRecord.setDisabled(false);
      });
  }
  onChangeUsersList(data) {
    this.usersList = data;
    this.validate.resetLinkTo();
  }
  onChangeDevicesList(data) {
    this.devicesList = data;
    this.validate.resetLinkTo();
  }
  onChangeGadgetsList(data) {
    this.gadgetsList = data;
    this.validate.resetLinkTo();
  }
  close() {
    this.opened = false;
    this.tab = 'PASSWORD_DETAIL';
    this.validate = new PasswordRecordValidate();
    this.showPassword = false;
    this.selectedUserAndDevices = [];
    this.devicesList = [];
    this.usersList = [];
    this.gadgetsList = [];
    this.showSecretCode = false;
    this.isEditSecretKey = false;
    this.editItem = null;
    if (this.intervalContainer) clearInterval(this.intervalContainer);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  deleteRecord() {
    this.confirmStateService.setConfirmAction(REMOVE_RECORD);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Are you sure you want to delete the password record?`;
    this.passwordManagerStateService.setRecordForRemove(this.editItem);
  }
  public trackByIndex(index, item) {
    return index;
  }
  getUserById(userId) {
    return this.usersStateService.getAllUsers().find(item => item.id === userId);
  }
  getUserName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
  getNameForAvatar(item) {
    return (this.usersStateService.getUserAvatarUrl(this.getUserById(item.userId)) == '') ? `${item.userName[0].toUpperCase()}${item.userName[item.userName.indexOf(" ") + 1].toUpperCase()}` : '';
  }
  ngOnDestroy() {
    if (this.intervalContainer) clearInterval(this.intervalContainer);
    this.sub.unsubscribe();
  }
}
