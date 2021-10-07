import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { GadgetsService } from "../../../services/gadgets/gadgets.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Company } from 'src/app/interfaces/quote/company';
import { PasswordRecordAdd } from '../class/password-record-add';
import { PasswordDeviceUser } from '../class/password-device-user';
import { PasswordRecordValidate } from '../class/password-record-validate';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { PasswordRecordCategories } from '../class/password-record-categories';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { Subscription } from 'rxjs';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn.directive';
import { PasswordManagerLinkedComponent } from './password-manager-linked/password-manager-linked.component';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { AppService } from 'src/app/states/app/app.service';


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
  public selectedUserAndDevices: Array<PasswordDeviceUser> = [];


  showAddCategory: boolean = false;

  public opened: boolean = false;
  validate: PasswordRecordValidate = new PasswordRecordValidate();
  formatDate: string = FORMAT_DATE_2;


  sub: Subscription = new Subscription();
  @ViewChild('linked') linked: PasswordManagerLinkedComponent;
  @ViewChild('categoriesSelect') categoriesSelect: DropDownComponent;
  @ViewChild('addRecord') addRecord: DisabledBtnDirective;
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
    private toastrService: ToastrService,
    public appService: AppService,
    private appStateService: AppStateService
  ) { }

  /**
   * Initializes Password manager edit aside. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
    let onAddForm = this.passwordManagerService.onAddForm.subscribe((res) => {
      this.passwordRecordAdd = new PasswordRecordAdd();
      this.passwordRecordAdd.setType(this.categories.find(item => item.name === "OFFICE_365_ACCOUNT"));
      let current = new Date();
      current.setFullYear(current.getFullYear() + 1);
      this.passwordRecordAdd.setExpiryDate(moment(current).format('YYYY/MM/DD'));
      this.opened = true;
      if (this.appService.checkMobile()) this.appService.toggleMobileAside(true);
    });
    this.sub.add(onAddForm);
    this.categories = this.passwordManagerStateService.getCategories();
    let onGetCategories = this.passwordManagerStateService.onGetCategories.subscribe((data: Array<PasswordRecordCategories>) => {
      this.categories = data;
      if (this.categoriesSelect) this.categoriesSelect.reset(this.categories);
    })
    this.sub.add(onGetCategories);
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
    this.linked.onSelectCompany(data);
  }
  selectType(data) {
    this.passwordRecordAdd.setType(data);
    if (data.UPPERCASE !== 'DEVICE' && data.UPPERCASE !== 'LOCAL_USER_ACCOUNT') this.validate.resetLinkTo();
  }
  onChangeDatePicker(data) {
    this.passwordRecordAdd.setExpiryDate(moment(new Date(data.year, data.month - 1, data.day)).format('YYYY/MM/DD'));
  }

  public onChangeLinked(data) {
    this.selectedUserAndDevices = data;
  }

  public save() {
    if (!this.validate.isValidate(this.passwordRecordAdd, this.selectedUserAndDevices)) return;
    this.addRecord.setDisabled(true);
    this.passwordManagerService.saveRecord(this.passwordRecordAdd.getDataForAdd(this.selectedUserAndDevices))
      .subscribe((res) => {
        this.addRecord.setDisabled(false);
        this.close();
      }, err => {
        this.addRecord.setDisabled(false);
      });
  }
  close() {
    this.opened = false;
    this.passwordRecordAdd = new PasswordRecordAdd();
    this.validate = new PasswordRecordValidate();
    this.selectedUserAndDevices = [];
    this.linked.onClosed();
    this.showAddCategory = false;
    this.appService.toggleMobileAside(false);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  public trackByIndex(index, item) {
    return index;
  }
}
