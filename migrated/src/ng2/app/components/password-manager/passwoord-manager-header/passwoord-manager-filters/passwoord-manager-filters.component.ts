import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Company } from 'src/ng2/app/interfaces/quote/company';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { PasswordManagerStateService } from 'src/ng2/app/states/password-manager/password-manager-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { TitleListType } from '../../../tickets/tickets/tickets-header/class/title-list-type';
import { FilterPasswordManager } from '../../class/filter-password-manager';
import { PasswordDeviceUser } from '../../class/password-device-user';
import { PasswordRecordCategories } from '../../class/password-record-categories';

@Component({
  selector: 'app-passwoord-manager-filters',
  templateUrl: './passwoord-manager-filters.component.html',
  styleUrls: ['./passwoord-manager-filters.component.scss']
})
export class PasswoordManagerFiltersComponent implements OnInit {

  showAddCategory: boolean = false;
  companies = [];
  categories: Array<PasswordRecordCategories> = [];
  disabledDevicesUsers: boolean = true;
  devicesUsers: Array<PasswordDeviceUser> = [];
  listDates: Array<TitleListType> = [new TitleListType('5 days', '5_DAYS'), new TitleListType('15 days', '15_DAYS'), new TitleListType('30 days', '30_DAYS')];
  @Output() onChangeCountFilter = new EventEmitter<any>();
  selectedCompany: Company;
  @ViewChild('categoriesSelect') categoriesSelect: DropDownComponent;
  @Input() disabledCompany: boolean = false;
  public filter: FilterPasswordManager = new FilterPasswordManager();
  constructor(
    private companiesState: CompaniesStateService,
    private passwordManagerStateService: PasswordManagerStateService,
    private usersStateService: UsersStateService,
    private devicesStateService: DevicesStateService) { }

  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.categories = this.passwordManagerStateService.getCategories();
    this.passwordManagerStateService.onGetCategories.subscribe((data: Array<PasswordRecordCategories>) => {
      this.categories = data;
      this.categoriesSelect.reset(this.categories);
    })
  }
  getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    if (this.disabledCompany) {
      this.selectedCompany = this.companies.find(item => item.id === localStorage.getItem('company_id'));
      this.filter.setCompany(this.selectedCompany);
      this.onChangeCounterFilter();

      let users = this.usersStateService.getAllUsers().filter(item => {
        let company = this.companies.find(itemCompany => itemCompany.id === item.company.id);
        let isArchived = item.deletedAt || !company;
        return !isArchived && item.company.id === this.selectedCompany.id
      });
      let devices = (this.devicesStateService.getAllDevices()[this.selectedCompany.id]) ? this.devicesStateService.getAllDevices()[this.selectedCompany.id] : [];
      users.forEach(item => {
        this.devicesUsers.push(new PasswordDeviceUser(item.id, `${item.firstName} ${item.lastName}`, 'USER'));
      })
      devices.forEach(item => {
        this.devicesUsers.push(new PasswordDeviceUser(item.id, this.getLabelDevice(item), 'DEVICE'));
      })

      this.disabledDevicesUsers = false;

    }
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
    this.filter.setCompany(data);
    this.passwordManagerStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
    if (data) {
      let users = this.usersStateService.getAllUsers().filter(item => {
        let company = this.companies.find(itemCompany => itemCompany.id === item.company.id);
        let isArchived = item.deletedAt || !company;
        return !isArchived && item.company.id === data.id
      });
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
    if (this.filter.selectedUserOrDevice) count++;
    this.onChangeCountFilter.emit(count);
  }
}
