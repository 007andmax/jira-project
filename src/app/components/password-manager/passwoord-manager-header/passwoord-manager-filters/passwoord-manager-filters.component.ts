import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanyDropDownComponent } from 'src/app/components/shared/company-drop-down/company-drop-down.component';
import { Company } from 'src/app/interfaces/company/company';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { TitleListType } from '../../../tickets/tickets/tickets-header/class/title-list-type';
import { FilterPasswordManager } from '../../class/filter-password-manager';
import { PasswordDeviceUser } from '../../class/password-device-user';
import { PasswordRecordCategories } from '../../class/password-record-categories';
import { PasswoordManagerDevicesUsersComponent } from '../../passwoord-manager-devices-users/passwoord-manager-devices-users.component';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { Device } from 'src/app/components/company-devices/class/device';

@Component({
  selector: 'app-passwoord-manager-filters',
  templateUrl: './passwoord-manager-filters.component.html',
  styleUrls: ['./passwoord-manager-filters.component.scss']
})
export class PasswoordManagerFiltersComponent implements OnInit, OnDestroy {

  showAddCategory: boolean = false;
  categories: Array<PasswordRecordCategories> = [];
  disabledDevicesUsers: boolean = true;
  devicesUsers: Array<PasswordDeviceUser> = [];
  listDates: Array<TitleListType> = [new TitleListType('5 days', '5'), new TitleListType('15 days', '15'), new TitleListType('30 days', '30')];
  @Output() onChangeCountFilter = new EventEmitter<any>();
  selectedCompany: Company;
  @ViewChild('categoriesSelect', { static: true }) categoriesSelect: DropDownComponent;
  @ViewChild('companiesSelect', { static: true }) companiesSelect: CompanyDropDownComponent;
  @ViewChild('deviceUserSelect', { static: true }) deviceUserSelect: PasswoordManagerDevicesUsersComponent;
  @ViewChild('dateSelect', { static: true }) dateSelect: DropDownComponent;
  @Input() disabledCompany: boolean = false;
  @Output() onClose = new EventEmitter();
  public filter: FilterPasswordManager = new FilterPasswordManager();
  sub: Subscription = new Subscription();
  constructor(
    private companiesState: CompaniesStateService,
    private passwordManagerStateService: PasswordManagerStateService,
    private usersStateService: UsersStateService,
    public appService: AppService,
    public cd: ChangeDetectorRef,
    private devicesService: DevicesService,
    public devicesStateService: DevicesStateService) { }


  ngOnInit() {
    if (this.passwordManagerStateService.getSelectedCategory()) this.categoriesSelect.onSelect(this.passwordManagerStateService.getSelectedCategory());
    if (this.companiesState.isInitLightAllCompanies) this.getClientsList(this.companiesState.getLightCompanies());
    if (!this.companiesState.isInitLightAllCompanies && this.companiesState.getCompanyRoutingId()) this.companiesState.onInitGetLightCompanies();
    let getOnCompanies = this.companiesState.onLightCompanies.subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
    this.categories = this.passwordManagerStateService.getCategories();
    let onGetCategories = this.passwordManagerStateService.onGetCategories.subscribe((data: Array<PasswordRecordCategories>) => {
      this.categories = data;
      if (this.categoriesSelect) this.categoriesSelect.reset(this.categories);
    })
    this.sub.add(onGetCategories);
    let onFilterByCategory = this.passwordManagerStateService.onFilterByCategory.subscribe((data) => {
      this.categoriesSelect.onSelect(data);
    })
    this.sub.add(onFilterByCategory);
    let onDeviceUninstalled = this.devicesStateService.onChangeDevice.subscribe(newChange => {
      if (this.selectedCompany.id == newChange.data.clientCompanyId) this.devicesStateService.changeDevice(this.devicesUsers, newChange);
    })
    this.sub.add(onDeviceUninstalled);
  }
  public onClearAll() {
    this.filter.setCategory(null);
    this.filter.setCompany(null);
    this.filter.setDeviceUser(null);
    this.filter.setDate(null);
    this.categoriesSelect.clearWithOutChanges();
    this.companiesSelect.clearWithOutChanges();
    this.deviceUserSelect.clearWithOutChanges();
    this.dateSelect.clearWithOutChanges();
    this.passwordManagerStateService.onInitFilter(this.filter);
    this.disabledDevicesUsers = false;
    this.selectedCompany = null;
    this.onChangeCounterFilter();
  }
  applyFilters() {

    this.passwordManagerStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
    this.close();
  }
  getClientsList(data) {

    if (this.disabledCompany) {
      this.selectedCompany = data.find(item => item.id === this.companiesState.getCompanyRoutingId());
      this.filter.setCompany(this.selectedCompany);
      this.onChangeCounterFilter();
      let users = this.usersStateService.getAllUsers().filter(item => {
        let company = data.find(itemCompany => item.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === itemCompany.id));
        let isArchived = item.deletedAt || !company;
        return !isArchived && item.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.selectedCompany.id)
      });
      users.forEach(item => {
        this.devicesUsers.push(new PasswordDeviceUser(item.id, `${item.firstName} ${item.lastName}`, 'USER'));
      })
      this.getDevices();
    }
  }
  getDevices() {
    this.filter.setPreloaderDevices(true);
    this.devicesService.getCompanyDevices(this.selectedCompany.id).subscribe((data: any) => {
      let devices = (data[this.selectedCompany.id]) ? JSON.parse(JSON.stringify(data[this.selectedCompany.id])).filter(item => !item.isCustom).map(item => new Device(item)) : [];
      devices.forEach(item => {
        this.devicesUsers.push(new PasswordDeviceUser(item.id, this.getLabelDevice(item), 'DEVICE'));
      })
      this.disabledDevicesUsers = false;
      this.filter.setPreloaderDevices(false);
    });
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
    this.selectedCompany = data;
    this.filter.setDeviceUser(null);
    this.filter.setCompany(data);
    this.deviceUserSelect.clearWithOutChanges();
    this.passwordManagerStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
    if (data) {
      let users = this.usersStateService.getAllUsers().filter(item => {
        let company = item.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === data.id);
        let isArchived = item.deletedAt || !company;
        return !isArchived && item.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === data.id)
      });
      users.forEach(item => {
        this.devicesUsers.push(new PasswordDeviceUser(item.id, `${item.firstName} ${item.lastName}`, 'USER'));
      })
      this.getDevices();
    } else {
      this.devicesUsers = [];
      this.disabledDevicesUsers = true;
    }
  }
  close() {
    this.onClose.emit(null);
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
    if (this.filter.selectedUserOrDevice) count++;
    this.onChangeCountFilter.emit(count);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
