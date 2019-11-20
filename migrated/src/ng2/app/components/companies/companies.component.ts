import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompaniesService } from '../../services/company/companies.service';
import { Company } from '../../interfaces/company/company';
import { CompaniesListService } from './services/companies-list.service';
import { UsersService } from '../../services/users/users.service';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { Subscription } from 'rxjs';
import { CompanyFilterTop } from './class/copany-filter-top';
import { DevicesSateService } from '../../states/devices/devices-sate.service';
import { UsersStateService } from '../../states/users/users-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { LeftPanelCompaniesFilter } from '../left-panel/left-panel-companies/class/left-panel-companies-filter';
import { CompanyCalculateCount } from './class/company-calculate-count';
import { CompaniesRealTimeService } from '../../states/company/companies-real-time.service';
import { CompanyUpdate } from './class/company-update';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  providers: [CompaniesListService]
})
export class CompaniesComponent implements OnInit, OnDestroy {

  CompaniesList: Array<Company> = [];
  reqCompaniesList: Array<Company> = [];
  showPreloader: boolean = true;
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  filter: Array<CompanyFilterTop> = [new CompanyFilterTop('name', 'ASC'),
  new CompanyFilterTop('address', ''),
  new CompanyFilterTop('primary_contact', ''),
  new CompanyFilterTop('email', ''),
  new CompanyFilterTop('tickets', ''),
  new CompanyFilterTop('devices', ''),
  new CompanyFilterTop('users', '')]
  public showArchivedCompanies: boolean = false;
  devices = [];
  users = [];
  sub: Subscription = new Subscription();
  left_filter: LeftPanelCompaniesFilter = new LeftPanelCompaniesFilter();
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  constructor(private companiesService: CompaniesService, private companiesList: CompaniesListService,
    private companiesStateService: CompaniesStateService, private userService: UsersService,
    private confirmStateService: ConfirmStateService, private devicesState: DevicesSateService, private usersStateService: UsersStateService,
    private leftPanelStateService: LeftPanelStateService,
    private companiesRealTimeService: CompaniesRealTimeService) { }

  ngOnInit() {
    this.companiesStateService.getOnShowArchived().subscribe(data => {
      this.showArchivedCompanies = data;
      console.log('data', data);
      this.left_filter.setClientType(null);
      this.clearFilter();
      this.setDefaultScoll();
      this.getClientsList(this.companiesStateService.getCompanies());
    })
    if (this.companiesStateService.getCompanies().length > 0) {
      this.getClientsList(this.companiesStateService.getCompanies());
    } else {
      this.companiesStateService.getOnCompanies().subscribe((data) => {

        this.getClientsList(data);
      })
    }
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) this.onArchiveCompany(this.companiesStateService.getCompanytForArchive().id);
    })
    this.sub.add(getConfirm);

    if (this.devicesState.getAllDevices()) {
      this.devices = this.devicesState.getAllDevices();

    } else {
      this.devicesState.getOnDevices().subscribe((data) => {

        this.devices = data;
      })
    }
    if (this.usersStateService.getAllUsers().length > 0) {
      this.users = this.usersStateService.getAllUsers();
    } else {
      this.usersStateService.getOnUsers().subscribe((data) => {
        this.users = data;
      })
    }
    let geLefttFilter = this.leftPanelStateService.getOnFilter().subscribe((data) => {
      this.left_filter = data;
      this.setDefaultScoll();
      this.onScroll();
      this.onInirCalculate();

    })
    this.sub.add(geLefttFilter);
  
    this.companiesStateService.getChangeCompanies().subscribe((data:CompanyUpdate) => {
      console.log('newChange', data);
     if (data.action === 'COMPANY_SAVED' || data.action === 'COMPANY_ARCHIVED') {
        console.log('++++++++++++++++++');
        const reqIndex = this.reqCompaniesList.findIndex((item) => item.id === data.data.id);
        if (reqIndex > -1) this.reqCompaniesList[reqIndex] = data.data;
        const companyIndex = this.CompaniesList.findIndex((item) => item.id === data.data.id);
        if (companyIndex > -1) this.CompaniesList[companyIndex] = data.data;
     }
    })
  }
  public onFilterTags(tags) {
    console.log('onFilterTags');
    if (tags.length > 0) {
      this.companiesService.getClientsByTags(tags).subscribe(data => {
        this.showPreloader = true;
        this.setDefaultScoll();
        this.getClientsList(data);

      })
    } else {
      this.setDefaultScoll();
      this.getClientsList(this.companiesStateService.getCompanies());

    }

  }
  private onInirCalculate() {
    this.calculateCount.onCalculate(this.reqCompaniesList, this.left_filter);
    this.companiesStateService.setCalculateCount(this.calculateCount);
  }
  private getClientsList(data) {
    this.reqCompaniesList = data.filter(item => item.accountType === 'CLIENT' && ((!this.showArchivedCompanies) ? !item.deletedAt : item.deletedAt));
    console.log('this.reqCompaniesList', this.reqCompaniesList);
    this.onInirCalculate();
    this.reqCompaniesList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.onScroll();
    this.showPreloader = false;
  }
  private getCompanies() {
    if (this.companiesList.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;
    let listFilter = this.left_filter.getFilterList(this.reqCompaniesList);
    let start = (this.page_number - 1) * 30;
    let end = ((this.page_number * 30) > listFilter.length) ? listFilter.length : this.page_number * 30;
    let CompaniesList = [];
    for (let i = start; i < end; i++) {
      CompaniesList.push(listFilter[i]);
    }
    this.CompaniesList = [...this.CompaniesList, ...CompaniesList];
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.companiesList.setBlockList(true);
    console.log('CompaniesList', this.CompaniesList);

  }
  onFilter(field) {

    let index = this.filter.findIndex(item => item.field === field);
    if (index > -1) {
      let sort = this.filter[index].filter;
      if (field === 'name') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterName();
        } else {
          this.filter[index].filter = 'DESC';
          this.reqCompaniesList.reverse();
        }

      }
      if (field === 'address') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {

          this.filter[index].filter = 'ASC';
          this.onFilterAdress();

        } else {
          console.log('333333333');
          this.filter[index].filter = 'DESC';
          this.reqCompaniesList.reverse();
        }


      }
      if (field === 'primary_contact') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterPrimaryContact();
        } else {
          this.filter[index].filter = 'DESC';
          this.reqCompaniesList.reverse();
        }


      }

      if (field === 'email') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterPrimaryEmail();
        } else {
          this.filter[index].filter = 'DESC';
          this.reqCompaniesList.reverse();
        }


      }
      if (field === 'tickets') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterTickets();
        } else {
          this.filter[index].filter = 'DESC';
          this.reqCompaniesList.reverse();
        }


      }
      if (field === 'devices') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterDevices();
          console.log(this.reqCompaniesList);
        } else {
          this.filter[index].filter = 'DESC';
          this.reqCompaniesList.reverse();
        }


      }
      if (field === 'users') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterUsers();
        } else {
          this.filter[index].filter = 'DESC';
          this.reqCompaniesList.reverse();
        }


      }

      this.page_number = 0;
      this.companiesList.setBlockList(false);
      this.CompaniesList = [];
      this.onScroll();
    }
  }
  private onFilterUsers() {
    this.reqCompaniesList.sort((a, b) => (this.getCountusers(a) > this.getCountusers(b)) ?
      1 : ((this.getCountusers(b) > this.getCountusers(a)) ? -1 : 0));
  }
  private onFilterDevices() {
    this.reqCompaniesList.sort((a, b) => (((this.devices[a.id]) ? this.devices[a.id].length : 0) > ((this.devices[b.id]) ? this.devices[b.id].length : 0)) ?
      1 : ((((this.devices[b.id]) ? this.devices[b.id].length : 0) > ((this.devices[a.id]) ? this.devices[a.id].length : 0)) ? -1 : 0));
  }
  private onFilterName() {
    this.reqCompaniesList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }

  private onFilterAdress() {
    this.reqCompaniesList.sort((a, b) => (this.getPrimaryAddress(a) > this.getPrimaryAddress(b)) ?
      1 : ((this.getPrimaryAddress(b) > this.getPrimaryAddress(a)) ? -1 : 0));
  }
  private onFilterPrimaryContact() {
    this.reqCompaniesList.sort((a, b) => (this.getPrimaryPhone(a).toLowerCase() > this.getPrimaryPhone(b).toLowerCase()) ?
      1 : ((this.getPrimaryPhone(b).toLowerCase() > this.getPrimaryPhone(a).toLowerCase()) ? -1 : 0));
  }
  private onFilterPrimaryEmail() {
    this.reqCompaniesList.sort((a, b) => (this.getEmail(a).toLowerCase() > this.getEmail(b).toLowerCase()) ?
      1 : ((this.getEmail(b).toLowerCase() > this.getEmail(a).toLowerCase()) ? -1 : 0));
  }
  private onFilterTickets() {
    this.reqCompaniesList.sort((a, b) => ((a.companyStatistic.ticketsSubmitted || 0) > (b.companyStatistic.ticketsSubmitted || 0)) ?
      1 : (((b.companyStatistic.ticketsSubmitted || 0) > (a.companyStatistic.ticketsSubmitted || 0)) ? -1 : 0));
  }
  private getCountusers(company) {
    return this.users.filter((user) => {
      var isArchived = user.deletedAt || company.deletedAt;
      return !isArchived && !this.showArchivedCompanies && user.company.id === company.id || this.showArchivedCompanies && isArchived && user.company.id === company.id;
    }).length;
  }
  private getPrimaryAddress(company) {
    let primaryAddress;
    if (company.companyInfo) {
      if (company.companyInfo.addresses) {
        for (let address of company.companyInfo.addresses) {
          if (address.isPrimary) primaryAddress = address;
        }
      }
    }
    if (primaryAddress) {
      return primaryAddress.addressWithSuitNumberAndPostalCode.toLowerCase();
    } else {
      return '';
    }
  }
  private clearFilter() {
    this.filter.forEach(item => item.filter = '');
  }
  private getPrimaryPhone(company) {
    let primaryContact;

    if (company.companyInfo) {
      if (company.companyInfo.contacts) {
        for (let contact of company.companyInfo.contacts) {
          if (!primaryContact || contact.priority > primaryContact.priority) primaryContact = contact;
        }
      }
    }

    return `${primaryContact.firstName} ${primaryContact.lastName}`;
  }

  private getEmail(company) {
    let primaryContact;

    if (company.companyInfo) {
      if (company.companyInfo.contacts) {
        for (let contact of company.companyInfo.contacts) {
          if (!primaryContact || contact.priority > primaryContact.priority) primaryContact = contact;
        }
      }


    }

    return primaryContact.primaryEmail;
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.companiesList.setBlockList(false);
    this.CompaniesList = [];
  }
  public onArchiveCompany(id) {
    console.log('onArchiveCompany', id);
    this.companiesService.archiveCompany(id).subscribe(data => {
      console.log('data', data);
      let index = this.CompaniesList.findIndex(item => item.id === id);
      if (index > -1) this.CompaniesList.splice(index, 1);
    })

  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getCompanies();

  }

  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
