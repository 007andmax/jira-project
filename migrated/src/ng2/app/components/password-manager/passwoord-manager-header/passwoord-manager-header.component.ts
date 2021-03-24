import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { ApiPasswordManagerService } from "../../../services/password-manager/api-password-manager.service";
import { PASSWORD_RECORD_TYPES } from 'src/ng2/app/const/password-record-types';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { TitleListType } from '../../tickets/tickets/tickets-header/class/title-list-type';
import { FilterPasswordManager } from '../class/filter-password-manager';
import { PasswordManagerStateService } from 'src/ng2/app/states/password-manager/password-manager-state.service';
import { PasswordDeviceUser } from '../class/password-device-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';


/**
 * Password manager header component
 */
@Component({
  selector: 'app-passwoord-manager-header',
  templateUrl: './passwoord-manager-header.component.html',
  styleUrls: ['./passwoord-manager-header.component.scss']
})
export class PasswoordManagerHeaderComponent implements OnInit, OnDestroy {
  showAddCategory: boolean = false;
  companies = [];
  disabledDevicesUsers: boolean = true;
  devicesUsers: Array<PasswordDeviceUser> = [];
  listDates: Array<TitleListType> = [new TitleListType('5 days', '5_DAYS'), new TitleListType('15 days', '15_DAYS'), new TitleListType('30 days', '30_DAYS')];
  PASSWORD_RECORD_TYPES = PASSWORD_RECORD_TYPES;
  public filter: FilterPasswordManager = new FilterPasswordManager();
  @Output() onChangeFilterField = new EventEmitter<any>();
  @Output() onSelectAll = new EventEmitter<any>();
  @Input() selectAll: boolean = false;
  sub: Subscription = new Subscription();
  /**
   * Creates an instance of the PasswordManagerComponent with the injected services
   * @param {ApiPasswordManagerService} apiPasswordManagerService Service to work with api
   * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {permissionsService} permissionsService to work with permissions service
   */
  constructor(
    private passwordManagerService: PasswordManagerService,
    private permissionsService: PermissionsService,
    private apiPasswordManagerService: ApiPasswordManagerService,
    private companiesState: CompaniesStateService,
    private passwordManagerStateService: PasswordManagerStateService,
    private usersStateService: UsersStateService,
    private devicesStateService: DevicesStateService
  ) { }

  /**
   * Initializes Password manager header. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
  }
  getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  toggleAll(data) {
    this.selectAll = true;
    this.onSelectAll.emit(data);
  }
  public onFilter(field) {
    this.onChangeFilterField.emit(field);
  }
  selectDate(data) {
    this.filter.setDate(data);
    this.passwordManagerStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  selectDeviceUser(data) {
    this.filter.setDeviceUser(data);
    this.passwordManagerStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  onSelectCategory(data) {
    this.filter.setCategory(data);
    this.passwordManagerStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  selectCompany(data) {
    this.filter.setCompany(data);
    this.passwordManagerStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
    if (data) {
      let users = this.usersStateService.getAllUsers().filter(item => item.company.id === data.id);
      let devices = (this.devicesStateService.getAllDevices()[data.id]) ? this.devicesStateService.getAllDevices()[data.id] : [];
      users.forEach(item => {
        this.devicesUsers.push(new PasswordDeviceUser(item.id, `${item.firstName} ${item.lastName}`, 'USER'));
      })
      devices.forEach(item => {
        this.devicesUsers.push(new PasswordDeviceUser(item.id, this.getLabelDevice(item), 'DEVICE'));
      })
      this.disabledDevicesUsers = false;
    } else {
      this.devicesUsers = [];
      this.disabledDevicesUsers = true;
    }
  }
  getLabelDevice(item) {
    if (item.label) return item.label;
    return item.hostName || item.ip;
  }
  public onChangeCounterFilter() {
    let count = 0;
    if (this.filter.selectedCategory) count++;
    if (this.filter.selectedCompany) count++;
    if (this.filter.selectedDate) count++;
    // this.changeCountFilter.emit(count);
  }
  /**
   * add new record event
   */
  public addRecord() {
    this.passwordManagerService.showAddForm();
  }

  /**
   * getPermission
   */
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }

  /**
   * destroy password manager header component
   */
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
