import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { GadgetsService } from "../../../services/gadgets/gadgets.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { Company } from 'src/ng2/app/interfaces/quote/company';
import { PasswordRecordAdd } from '../class/password-record-add';
import { PasswordDeviceUser } from '../class/password-device-user';
import { PasswordRecordValidate } from '../class/password-record-validate';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { PasswordRecordCategories } from '../class/password-record-categories';
import { PasswordManagerStateService } from 'src/ng2/app/states/password-manager/password-manager-state.service';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';


@Component({
  selector: 'app-password-manager-add-aside',
  templateUrl: './password-manager-add-aside.component.html',
  styleUrls: ['./password-manager-add-aside.component.scss']
})
export class PasswordManagerAddAsideComponent implements OnInit {
  showPassword: boolean = false;
  companies: Array<Company> = [];
  categories: Array<PasswordRecordCategories> = [];
  passwordRecordAdd: PasswordRecordAdd = new PasswordRecordAdd();
  public devicesList = [];
  public usersList = [];
  public gadgets = [];
  public selectedUserAndDevices: Array<PasswordDeviceUser> = [];
  public showSelect = false;
  showAddCategory: boolean = false;
  public tabs = ['User', 'Device', 'Not monitored'];
  public currentTab = this.tabs[0];
  public opened: boolean = false;
  validate: PasswordRecordValidate = new PasswordRecordValidate();
  formatDate: string = FORMAT_DATE_2;
  public showGadgetsForm: any;
  public newGadgets: any;
  @ViewChild('categoriesSelect') categoriesSelect: DropDownComponent;
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
    private gadgetsService: GadgetsService,
    private permissionsService: PermissionsService,
    private passwordManagerStateService: PasswordManagerStateService,
    public cd: ChangeDetectorRef,
    private companiesState: CompaniesStateService,
    private devicesStateService: DevicesStateService,
    private usersStateService: UsersStateService,
  ) { }

  /**
   * Initializes Password manager edit aside. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.passwordManagerService.onAddForm.subscribe((res) => {

      this.passwordRecordAdd = new PasswordRecordAdd();
      this.passwordRecordAdd.setType(this.categories.find(item => item.name === "OFFICE_365_ACCOUNT"));
      this.passwordRecordAdd.setExpiryDate(moment(new Date()).format('YYYY/MM/DD'));
      console.log("this.passwordRecordAdd", this.passwordRecordAdd);
      this.opened = true;
    });
    this.categories = this.passwordManagerStateService.getCategories();
    this.passwordManagerStateService.onGetCategories.subscribe((data: Array<PasswordRecordCategories>) => {
      this.categories = data;
      this.categoriesSelect.reset(this.categories);
    })
  }
  public onChangeDescription(event) {
    this.passwordRecordAdd.description = event.target.value;
  }
  public onPastDescription(value) {
    this.passwordRecordAdd.description = value;
  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  selectCompany(data) {
    this.passwordRecordAdd.setCompany(data);
    this.usersList = [];
    this.devicesList = [];
    this.gadgets = [];
    if (data) {
      let users = this.usersStateService.getAllUsers().filter(item => item.company.id === data.id);
      users.forEach(item => {
        this.usersList.push(new PasswordDeviceUser(item.id, `${item.firstName} ${item.lastName}`, 'USER'));
      })
      let devices = (this.devicesStateService.getAllDevices()[data.id]) ? this.devicesStateService.getAllDevices()[data.id] : [];
      devices.forEach(item => {
        this.devicesList.push(new PasswordDeviceUser(item.id, this.getLabelDevice(item), 'DEVICE'));
      })
      this.getGadgets();
    }
    this.validate.resetCompany();
  }
  isSeleted(item) {
    return this.selectedUserAndDevices.find(element => element.id === item.id);
  }
  removeItem(index) {
    this.selectedUserAndDevices.splice(index, 1);
  }
  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }
  public deleteGadget($event, id) {
    this.stopEvent($event);
    this.gadgetsService.deleteGadget(id)
      .subscribe((res: any) => this.gadgets = this.gadgets.filter((item) => item.id !== id))
  }
  public setCurrentTab($event, item) {
    this.stopEvent($event);
    this.currentTab = item;
    this.showGadgetsForm = false;
    this.cd.detectChanges();
  }
  public addGadgetsform() {
    const clientCompanyId = this.passwordRecordAdd.client.id;
    const name = this.newGadgets;
    this.gadgetsService.addNewGadget(clientCompanyId, name).subscribe((res: any) => {
      this.gadgets.push(new PasswordDeviceUser(res.id, res.name, 'GADGET'));
      this.showGadgetsForm = false;
    })
  }
  public showGadgetsAddForm($event) {
    this.stopEvent($event);
    this.showGadgetsForm = !this.showGadgetsForm;
  }
  public getGadgets() {
    this.gadgetsService.getCompanyDevices().subscribe((res: any) => {
      this.gadgets = res.map(item => new PasswordDeviceUser(item.id, item.name, 'GADGET'));
      console.log("this.gadgets", this.gadgets);
    });
  }
  getLabelDevice(item) {
    if (item.label) return item.label;
    return item.hostName || item.ip;
  }
  selectType(data) {

    this.passwordRecordAdd.setType(data);
    if (data.UPPERCASE !== 'DEVICE' && data.UPPERCASE !== 'LOCAL_USER_ACCOUNT') this.validate.resetLinkTo();
  }
  onChangeDatePicker(data) {
    this.passwordRecordAdd.setExpiryDate(moment(new Date(data.year, data.month - 1, data.day)).format('YYYY/MM/DD'));
  }
  public toggleItem(newItem) {
    let findIndex = this.selectedUserAndDevices.findIndex(item => item.id === newItem.id);
    if (findIndex > -1) {
      this.selectedUserAndDevices.splice(findIndex, 1);
    } else {
      this.selectedUserAndDevices.push(newItem);
    }
    this.validate.resetLinkTo();
  }
  public showSelectWrapper($event) {
    this.showSelect = !this.showSelect;
    this.stopEvent($event);
    this.cd.detectChanges();
  }
  public hideSelectWrapper() {
    this.showSelect = false;
    this.showGadgetsForm = false;
  }
  public save() {
    if (!this.validate.isValidate(this.passwordRecordAdd, this.selectedUserAndDevices)) return;
    this.passwordManagerService.saveRecord(this.passwordRecordAdd.getDataForAdd(this.selectedUserAndDevices))
      .subscribe((res) => {
        this.close();
      });
  }
  close() {
    this.opened = false;
    this.passwordRecordAdd = new PasswordRecordAdd();
    this.validate = new PasswordRecordValidate();
    this.selectedUserAndDevices = [];
    this.devicesList = [];
    this.usersList = [];
    this.gadgets = [];
    this.currentTab = this.tabs[0];
    this.showSelect = false;
    this.showAddCategory = false;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy() {

  }
  public trackByIndex(index, item) {
    return index;
  }
}
