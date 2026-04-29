import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CompaniesService } from '../../services/company/companies.service';
import { CompaniesListService } from './services/companies-list.service';
import { UsersService } from '../../services/users/users.service';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { Subscription } from 'rxjs';
import { DevicesStateService } from '../../states/devices/devices-state.service';
import { UsersStateService } from '../../states/users/users-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { CompanyCalculateCount } from './class/company-calculate-count';
import { CompanyUpdate } from './class/company-update';
import { ARCHIVE_COMPANY, DEARCHIVE_COMPANY } from '../../const/confirm';
import { DraftEmailStateService } from '../../states/draft-email/draft-email-state.service';
import { CompanyFilter } from './class/company-filter';
import { CompanyItem } from './class/company-item';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { CompanyDeviceCount } from './class/company-device-count';
import { CompaniesHeaderComponent } from './companies-header/companies-header.component';
import { fadeInAnimation } from 'src/app/animations';
import { TicketSortBy } from '../tickets/tickets/class/ticket-sort-by';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  providers: [CompaniesListService]
})
export class CompaniesComponent implements OnInit, OnDestroy {
  @ViewChild('header', { static: true }) header: CompaniesHeaderComponent;
  selectAll: boolean = false;
  toggleFilter: boolean = false;
  CompaniesList: Array<CompanyItem> = [];
  reqCompaniesList: Array<CompanyItem> = [];
  showPreloader: boolean = true;
  infiniteScrollDisabled = false;
  page_number: number = 0;
  companyFilter: CompanyFilter = new CompanyFilter();
  showArchivedCompanies: boolean = false;
  sub: Subscription = new Subscription();
  left_filter: string;
  devicesCounts: Array<CompanyDeviceCount> = [];
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  container = document.body.querySelector(".main-container");

  constructor(private companiesService: CompaniesService,
    private companiesList: CompaniesListService,
    private companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    private usersStateService: UsersStateService,
    private leftPanelStateService: LeftPanelStateService,
    private draftEmailStateService: DraftEmailStateService,
    private permissionsService: PermissionsService,
    private devicesService: DevicesService,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.devicesCounts = this.companiesStateService.getDevicesCounts();
    this.companyFilter.setDevices(this.devicesCounts);
    this.left_filter = this.leftPanelStateService.getFilter();
    if (this.companiesStateService.getCompanies().length > 0 && !this.left_filter) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      if (!this.left_filter) this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
    if (this.left_filter) {
      if (this.left_filter !== "ARCHIVE") this.companyFilter.setClientType(this.left_filter);
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.setDefaultScoll();
      this.showArchivedCompanies = (this.left_filter === "ARCHIVE");
      this.companyFilter.setShowArchivedCompanies(this.showArchivedCompanies);
      if (this.left_filter) this.companyFilter.setArchived(this.left_filter === "ARCHIVE");
      if (this.left_filter == null) this.companyFilter.setArchived(undefined);
      this.getClientsListByFilter();
    }
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === ARCHIVE_COMPANY) {
          if (!this.companiesStateService.getCompanytForArchive().isExample) this.onArchiveCompany(this.companiesStateService.getCompanytForArchive().id);
          if (this.companiesStateService.getCompanytForArchive().isExample) this.onArchiveExampleCompany(this.companiesStateService.getCompanytForArchive().id);
        }
        if (this.confirmStateService.getConfirmAction() === DEARCHIVE_COMPANY) {
          this.onDeArchiveCompany(this.companiesStateService.getCompanyFortDeArchive().id);
        }
      }
    })
    this.sub.add(getConfirm);
    if (this.usersStateService.getAllUsers().length > 0) this.companyFilter.setUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.companyFilter.setUsers(data);
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.companyFilter.setUsers(this.usersStateService.getAllUsers());
    })
    this.sub.add(onChangeUsers);
    let filter = this.companiesStateService.filter.subscribe(data => {
      this.showPreloader = true;
      this.companyFilter.setFilters(data);
      document.body.querySelector(".main-container").scrollTo(0, 0);
      (<any>document.body.querySelector(".qt-page-list__header-thead-container .qt-checkbox input")).checked = false;
      this.setDefaultScoll();
      this.showArchivedCompanies = (data.clientType === "ARCHIVE");
      this.companyFilter.setShowArchivedCompanies(this.showArchivedCompanies);
      this.companyFilter.setArchived(data.clientType === "ARCHIVE");
      if (this.companyFilter.isExistFilters()) this.getClientsListByFilter();
      if (!this.companyFilter.isExistFilters()) this.getClientsList(this.companiesStateService.getCompanies());
    })
    this.sub.add(filter);
    let getChangeCompanies = this.companiesStateService.getChangeCompanies().subscribe((data: CompanyUpdate) => {
      if (data.action === 'COMPANY_SAVED' || data.action === 'COMPANY_ARCHIVED') {
        const reqIndex = this.reqCompaniesList.findIndex((item) => item.id === data.data.id);
        if (reqIndex > -1) this.reqCompaniesList[reqIndex] = new CompanyItem(data.data);
        if (reqIndex === -1) {
          this.reqCompaniesList.unshift(new CompanyItem(data.data));
          this.CompaniesList.unshift(new CompanyItem(data.data));
        }
        const companyIndex = this.CompaniesList.findIndex((item) => item.id === data.data.id);
        if (companyIndex > -1) this.CompaniesList[companyIndex] = new CompanyItem(data.data);
      }
      if (data.action === 'COMPANY_DEARCHIVED') {
        const reqIndex = this.reqCompaniesList.findIndex((item) => item.id === data.data.id);
        if (reqIndex > -1) this.reqCompaniesList[reqIndex] = new CompanyItem(data.data);
        if (this.showArchivedCompanies) {
          const companyIndex = this.CompaniesList.findIndex((item) => item.id === data.data.id);
          if (companyIndex > -1) this.CompaniesList.splice(companyIndex, 1);
        }
      }
      this.header.setReqCompaniesList(this.reqCompaniesList);
      this.cd.detectChanges();
    })
    this.sub.add(getChangeCompanies);
    let onChangeDevicesCount = this.companiesStateService.onChangeDevicesCount.subscribe(data => {
      this.devicesCounts = data;
      this.companyFilter.setDevices(data);
      this.cd.detectChanges();
    })
    this.sub.add(onChangeDevicesCount);
    let onToggleFilter = this.companiesStateService.onToggleFilter.subscribe(data => {
      this.toggleFilter = data;
    })
    this.sub.add(onToggleFilter);
  }
  onSearch(value) {
    this.companyFilter.setSearch((value !== "") ? value : null);
    this.setDefaultScoll();
    this.onScroll();
  }
  getDevicesCounts(ids) {
    this.devicesService.getCountByCompany(ids).subscribe((data: any) => {
      this.devicesCounts = data.map(item => new CompanyDeviceCount(item));
      this.companyFilter.setDevices(this.devicesCounts);
      this.companiesStateService.setDevicesCounts(data.map(item => new CompanyDeviceCount(item)));
    })
  }
  onSelectCompany(company) {
    this.reqCompaniesList.find(item => item.id === company.id).selected = company.selected;
    this.selectAll = (this.reqCompaniesList.find(item => !item.selected)) ? false : true;
    this.header.setReqCompaniesList(this.reqCompaniesList);
    this.cd.detectChanges();
  }
  toggleAllCompanies(event) {
    this.selectAll = event.target.checked;
    this.onSelectAllCompanies(this.selectAll);
    this.cd.detectChanges();
  }
  onFilter(data) {
    this.companyFilter.sortBy.sortBy = data;
    this.companyFilter.onFilter(data, this.reqCompaniesList);
    console.log("sortBy.sortDirection", this.companyFilter.sortBy.sortDirection);
    this.setDefaultScoll();
    this.onScroll();
  }
  onSelectAllCompanies(data) {
    if (data) {
      let listFilter = this.reqCompaniesList;
      this.draftEmailStateService.resetSelectedCompanies();
      listFilter.forEach(item => {
        item.selected = true;
        this.draftEmailStateService.addSelectedCompany(item);
      });
      this.CompaniesList.forEach(item => {
        item.selected = true;
      });
    } else {
      this.draftEmailStateService.resetSelectedCompanies();
      this.reqCompaniesList.forEach(item => {
        item.selected = false;
      });
      this.CompaniesList.forEach(item => {
        item.selected = false;
      });
    }
  }
  showMobileFilter() {
    document.body.querySelector('app-left-panel-companies').classList.add('show');
  }
  private onInirCalculate() {
    this.calculateCount.onCalculate(this.reqCompaniesList, this.companyFilter.clientType);
    this.companiesStateService.setCalculateCount(this.calculateCount);
  }
  private getClientsList(data) {
    this.reqCompaniesList = data.filter(item => item.accountType === 'CLIENT' && ((!this.showArchivedCompanies) ? !item.deletedAt : item.deletedAt));
    if (this.devicesCounts.length == 0) this.getDevicesCounts(this.reqCompaniesList.map(item => item.id));
    this.onInirCalculate();
    this.reqCompaniesList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.onScroll();
    this.showPreloader = false;

  }
  private getClientsListByFilter() {
    this.companiesService.getCompaniesListByFilter(this.companyFilter.getDataForFilter()).subscribe((data: any) => {
      this.reqCompaniesList = data;
      if (this.devicesCounts.length == 0) this.getDevicesCounts(this.reqCompaniesList.map(item => item.id));
      this.onInirCalculate();
      this.reqCompaniesList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.onScroll();
      this.showPreloader = false;
    })
  }
  private getCompanies() {
    console.log("this.infiniteScrollDisabled", this.infiniteScrollDisabled);
    console.log("this.companiesList.getBlockList()", this.companiesList.getBlockList());
    if (this.companiesList.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;

    let listFilter = this.companyFilter.getFilterList(this.reqCompaniesList);
    this.calculateCount.onCalculate(listFilter, this.companyFilter.clientType);
    this.companiesStateService.setCalculateCount(this.calculateCount);
    let start = (this.page_number - 1) * 30;
    let end = ((this.page_number * 30) > listFilter.length) ? listFilter.length : this.page_number * 30;
    let CompaniesList = [];
    for (let i = start; i < end; i++) {
      CompaniesList.push(listFilter[i]);
    }
    this.CompaniesList = [...this.CompaniesList, ...CompaniesList];
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.companiesList.setBlockList(true);

    console.log("this.infiniteScrollDisabled", this.infiniteScrollDisabled);
    console.log("this.companiesList.getBlockList()", this.companiesList.getBlockList());
    this.showPreloader = false;
  }
  public isSelectedConpanies() {
    return this.CompaniesList.find(item => item.selected);
  }

  public setDefaultScoll() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.page_number = 0;
    this.companiesList.setBlockList(false);
    this.CompaniesList = [];
  }
  public onDeArchiveCompany(id) {
    let deArchive = this.companiesService.deArchive(id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      let index = this.CompaniesList.findIndex(item => item.id === id);
      if (index > -1) this.CompaniesList.splice(index, 1);
    }, err => {
      this.confirmStateService.initRequest(false);
    })
    this.sub.add(deArchive);
  }
  public onArchiveCompany(id) {
    let archiveCompany = this.companiesService.archiveCompany(id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      let index = this.CompaniesList.findIndex(item => item.id === id);
      if (index > -1) this.CompaniesList.splice(index, 1);
    }, err => {
      this.confirmStateService.initRequest(false);
    })
    this.sub.add(archiveCompany);
  }
  public onArchiveExampleCompany(id) {
    let archiveCompany = this.companiesService.archiveExampleCompany().subscribe(data => {
      this.confirmStateService.initRequest(false);
      let index = this.CompaniesList.findIndex(item => item.id === id);
      if (index > -1) this.CompaniesList.splice(index, 1);
    }, err => {
      this.confirmStateService.initRequest(false);
    })
    this.sub.add(archiveCompany);
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getCompanies();
  }
  onAddCompany() {
    this.companiesStateService.toggleAsideForAdd();
  }
  public trackById(index, item) {
    return item.id;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  onChangeCountFilter(data) {
    // this.countFilter = data;
    this.cd.markForCheck();
  }
  onToggleFilter(data) {
    this.toggleFilter = data;
    this.companiesStateService.changeToggleFilter(this.toggleFilter);
    this.cd.markForCheck();
  }
  ngOnDestroy(): void {
    this.reqCompaniesList.forEach(item => item.selected = false);
    this.draftEmailStateService.resetSelectedCompanies();
    this.leftPanelStateService.clearFilter();
    this.sub.unsubscribe();
  }
}
