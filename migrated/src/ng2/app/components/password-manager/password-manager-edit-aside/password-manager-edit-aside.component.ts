import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { PasswordRecord } from '../class/password-record';
import { PasswordDeviceUser } from '../class/password-device-user';
import { PasswordRecordValidate } from '../class/password-record-validate';
import { Company } from 'src/ng2/app/interfaces/quote/company';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { PasswordManagerStateService } from 'src/ng2/app/states/password-manager/password-manager-state.service';
import { REMOVE_RECORD } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { PasswordRecordCategories } from '../class/password-record-categories';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';

/**
 * Password manager edit aside component
 */
@Component({
  selector: 'app-password-manager-edit-aside',
  templateUrl: './password-manager-edit-aside.component.html',
  styleUrls: ['./password-manager-edit-aside.component.scss'],

})
export class PasswordManagerEditAsideComponent implements OnInit {
  public selectedClient: any;
  public opened: boolean = false;
  tab: string = 'PASSWORD_DETAIL'
  categories: Array<PasswordRecordCategories> = [];
  companies: Array<Company> = [];
  public editItem: PasswordRecord = null;
  showPassword: boolean = false;
  validate: PasswordRecordValidate = new PasswordRecordValidate();
  selectedUserAndDevices: Array<PasswordDeviceUser> = [];
  @ViewChild('categoriesSelect') categoriesSelect: DropDownComponent;
  public devicesList = [];
  public usersList = [];
  public gadgetsList = [];
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
    private usersStateService: UsersStateService,
    private elRef: ElementRef,
  ) { }

  /**
   * Initializes Password manager edit aside. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.passwordManagerService.onEditForm.subscribe((res) => {
      this.editItem = new PasswordRecord(JSON.parse(JSON.stringify(res)));
      console.log("this.editItem", this.editItem);
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

      this.selectedClient = this.companiesState.getCompanies().find(item => item.id === this.editItem.companyId);
      this.opened = true;
    });
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_RECORD) {
          this.close();
        }
      }
    })
    this.categories = this.passwordManagerStateService.getCategories();
    this.passwordManagerStateService.onGetCategories.subscribe((data: Array<PasswordRecordCategories>) => {
      this.categories = data;
      this.categoriesSelect.reset(this.categories);
    })

  }
  onInitDescription() {
    this.elRef.nativeElement.querySelector('#record-description').value = this.editItem.description;
    this.cd.detectChanges();
    console.log("onInitDescription");
  }
  public onChangeDescription(event) {
    this.editItem.description = event.target.value;
  }
  public onPastDescription(value) {
    this.editItem.description = value;
  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }

  selectCompany(data) {
    this.selectedClient = data;
    this.editItem.setCompanyId(data.id);
    this.validate.resetCompany();
  }
  selectType(data) {

    this.editItem.setType(data);
    if (data.name !== 'DEVICE' && data.name !== 'LOCAL_USER_ACCOUNT') this.validate.resetLinkTo();
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
  }
  public save() {
    if (!this.validate.isValidateEdit(this.editItem, this.selectedUserAndDevices)) {
      console.log("this.validate", this.validate);
      return;
    }
    this.passwordManagerService.editRecord(this.editItem.getDataForEdit(this.selectedUserAndDevices))
      .subscribe((res) => {
        this.close();
      });
  }
  close() {
    this.opened = false;
    this.tab = 'PASSWORD_DETAIL';
    this.showPassword = false;
    this.selectedUserAndDevices = [];
    this.devicesList = [];
    this.usersList = [];
    this.gadgetsList = [];
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  deleteRecord() {
    this.confirmStateService.setConfirmAction(REMOVE_RECORD);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Are you sure you want to delete the password record?`;
    this.passwordManagerStateService.setRecordForRemove(this.editItem);
  }

  ngOnDestroy() {


  }
  public trackByIndex(index, item) {
    return index;
  }

  getUserAvatarUrl(user) {
    if (!(user && user.avatar)) return '';

    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) 0% 0% / cover no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) 0% 0% / cover no-repeat`;
    } else {
      return 'url(/users/default/image.jpg) 0% 0% / cover no-repeat';
    }
  };
  getUserById(userId) {
    return this.usersStateService.getAllUsers().find(item => item.id === userId);
  }
  getUserName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
  getNameForAvatar(user) {
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
}
