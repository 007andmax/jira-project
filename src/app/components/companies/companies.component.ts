import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CompaniesService } from '../../services/company/companies.service';
import { CompaniesListService } from './services/companies-list.service';
import { UsersService } from '../../services/users/users.service';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { Subscription } from 'rxjs';
import { CompanyFilterTop } from './class/company-filter-top';
import { DevicesStateService } from '../../states/devices/devices-state.service';
import { UsersStateService } from '../../states/users/users-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { LeftPanelCompaniesFilter } from '../left-panel/left-panel-companies/class/left-panel-companies-filter';
import { CompanyCalculateCount } from './class/company-calculate-count';
import { CompanyUpdate } from './class/company-update';
import { ARCHIVE_COMPANY, DEARCHIVE_COMPANY } from '../../const/confirm';
import { DraftEmailStateService } from '../../states/draft-email/draft-email-state.service';
import { CompanyFilter } from './class/company-filter';
import { CompanyItem } from './class/company-item';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  providers: [CompaniesListService]
})
export class CompaniesComponent implements OnInit, OnDestroy {
  CompaniesList: Array<CompanyItem> = [];
  reqCompaniesList: Array<CompanyItem> = [];
  showPreloader: boolean = true;
  infiniteScrollDisabled = false;
  page_number: number = 0;
  companyFilter: CompanyFilter = new CompanyFilter();
  showArchivedCompanies: boolean = false;
  sub: Subscription = new Subscription();
  left_filter: string;
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();

  constructor(private companiesService: CompaniesService,
    private companiesList: CompaniesListService,
    private companiesStateService: CompaniesStateService,
    private userService: UsersService,
    private confirmStateService: ConfirmStateService,
    private devicesState: DevicesStateService,
    private usersStateService: UsersStateService,
    private leftPanelStateService: LeftPanelStateService,
    private draftEmailStateService: DraftEmailStateService,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.left_filter = this.leftPanelStateService.getFilter();
    if (this.companiesStateService.getCompanies().length > 0 && !this.left_filter) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      if (!this.left_filter) this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
    if (this.left_filter) {
      if (this.left_filter !== "ARCHIVE") this.companyFilter.setClientType(this.left_filter);
      window.scrollTo(0, 0);
      this.setDefaultScoll();
      this.showArchivedCompanies = (this.left_filter === "ARCHIVE");
      this.companyFilter.setShowArchivedCompanies(this.showArchivedCompanies);
      this.companyFilter.setArchived(this.left_filter === "ARCHIVE");
      this.getClientsListByFilter();
    }
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === ARCHIVE_COMPANY) {
          this.onArchiveCompany(this.companiesStateService.getCompanytForArchive().id);
        }
        if (this.confirmStateService.getConfirmAction() === DEARCHIVE_COMPANY) {
          this.onDeArchiveCompany(this.companiesStateService.getCompanyFortDeArchive().id);
        }
      }
    })
    this.sub.add(getConfirm);
    if (this.devicesState.getAllDevices()) this.companyFilter.setDevices(this.devicesState.getAllDevices());
    let getOnDevices = this.devicesState.getOnDevices().subscribe((data) => {
      this.companyFilter.setDevices(data);

    })
    this.sub.add(getOnDevices);
    if (this.usersStateService.getAllUsers().length > 0) this.companyFilter.setUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.companyFilter.setUsers(data);

    })
    this.sub.add(getOnUsers);
    let filter = this.companiesStateService.filter.subscribe(data => {
      this.showPreloader = true;
      this.companyFilter.setFilters(data);
      window.scrollTo(0, 0);
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
    })
    this.sub.add(getChangeCompanies);
  }
  onFilter(data) {
    this.companyFilter.onFilter(data, this.reqCompaniesList);
    this.page_number = 0;
    this.companiesList.setBlockList(false);
    this.CompaniesList = [];
    this.onScroll();
  }
  onSelectAllCompanies(event) {
    if (event.target.checked) {
      let listFilter = this.reqCompaniesList;
      this.draftEmailStateService.resetSelectedCompanies();
      listFilter.forEach(item => {
        item.selected = true;
        this.draftEmailStateService.addSelectedCompany(item);
      });
    } else {
      this.draftEmailStateService.resetSelectedCompanies();

      this.reqCompaniesList.forEach(item => {
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

    this.onInirCalculate();
    this.reqCompaniesList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.onScroll();
    this.showPreloader = false;

  }
  private getClientsListByFilter() {
    this.companiesService.getCompaniesListByFilter(this.companyFilter.getDataForFilter()).subscribe((data: any) => {
      this.reqCompaniesList = data;
      this.onInirCalculate();
      this.reqCompaniesList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.onScroll();
      this.showPreloader = false;
    })
    //this.reqCompaniesList = data.filter(item => item.accountType === 'CLIENT' && ((!this.showArchivedCompanies) ? !item.deletedAt : item.deletedAt));

  }
  private getCompanies() {
    if (this.companiesList.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;

    let listFilter = this.reqCompaniesList;
    let start = (this.page_number - 1) * 30;
    let end = ((this.page_number * 30) > listFilter.length) ? listFilter.length : this.page_number * 30;
    let CompaniesList = [];
    for (let i = start; i < end; i++) {
      CompaniesList.push(listFilter[i]);
    }
    this.CompaniesList = [...this.CompaniesList, ...CompaniesList];
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.companiesList.setBlockList(true);
    this.showPreloader = false;
  }








  public setDefaultScoll() {
    this.page_number = 0;
    this.companiesList.setBlockList(false);
    this.CompaniesList = [];
  }
  public onDeArchiveCompany(id) {
    let deArchive = this.companiesService.deArchive(id).subscribe(data => {
      let index = this.CompaniesList.findIndex(item => item.id === id);
      if (index > -1) this.CompaniesList.splice(index, 1);
    })
    this.sub.add(deArchive);
  }
  public onArchiveCompany(id) {
    let archiveCompany = this.companiesService.archiveCompany(id).subscribe(data => {
      let index = this.CompaniesList.findIndex(item => item.id === id);
      if (index > -1) this.CompaniesList.splice(index, 1);
    })
    this.sub.add(archiveCompany);
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getCompanies();
  }

  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.reqCompaniesList.forEach(item => item.selected = false);
    this.draftEmailStateService.resetSelectedCompanies();
    this.sub.unsubscribe();
  }
}
