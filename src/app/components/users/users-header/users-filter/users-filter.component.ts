import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanyTagsComponent } from 'src/app/components/companies/company-tags/company-tags.component';
import { CrmCompanyIndustry } from 'src/app/components/setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { CrmCompanyJobTitle } from 'src/app/components/setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { CompanyIndustry } from 'src/app/interfaces/company/company-industry';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { UserFilter } from '../../class/user-filter';
import { UsersFilterSubscriptionsComponent } from './users-filter-subscriptions/users-filter-subscriptions.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UserFilters } from '../../class/user-filters';
import { TicketsFilterCompaniesDropDownComponent } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-companies-drop-down/tickets-filter-companies-drop-down.component';
import { UserDefaultSubscription } from '../../class/user-default-subscription';
import { UsersFilterJobTitleComponent } from './users-filter-job-title/users-filter-job-title.component';
import { UsersFilterIndustryComponent } from './users-filter-industry/users-filter-industry.component';

@Component({
  selector: 'app-users-filter',
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFilterComponent implements OnInit {
  @ViewChild('jobTitleDp') jobTitleDp: UsersFilterJobTitleComponent;
  @ViewChild('companiesDp') companiesDp: TicketsFilterCompaniesDropDownComponent;
  @ViewChild('industriesDp') industriesDp: UsersFilterIndustryComponent;
  @ViewChild('subscriptionDp') subscriptionDp: UsersFilterSubscriptionsComponent;
  @ViewChild('tagsDp') tagsDp: CompanyTagsComponent;
  @Output() onClearAll = new EventEmitter();
  @Output() onClose = new EventEmitter();
  industries: Array<CrmCompanyIndustry> = [];
  public filter: UserFilters = new UserFilters();
  sub: Subscription = new Subscription();
  constructor(private companiesState: CompaniesStateService,
    private crmStateService: CrmStateService,
    private customerPortalStateService: CustomerPortalStateService,
    private usersStateService: UsersStateService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.customerPortalStateService.isCustomerPortal && this.companiesState.getCompanies().length > 0) this.checkCompanyCustomerUser();
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      if (this.customerPortalStateService.isCustomerPortal) this.checkCompanyCustomerUser();
    })
    this.sub.add(getOnCompanies);
    let onTicketFilters = this.customerPortalStateService.onUsersFilters.subscribe(data => (this.checkCompanyCustomerUser()));
    this.sub.add(onTicketFilters);

    this.industries = this.crmStateService.getIndustryList();
    let onGetIndustry = this.crmStateService.onGetIndustry.subscribe(data => {
      this.industries = data;
      this.ref.markForCheck();
    })
    this.sub.add(onGetIndustry);
    let onLeftPanelMarketingFilter = this.usersStateService.onLeftPanelMarketingFilter.subscribe((data) => {
      this.subscriptionDp.clearCustomSubscription();
      this.filter.setCustomSubscriptions([]);
      if (data) {
        this.subscriptionDp.toggleSubscription(this.subscriptionDp.reqSubscriptions.find(item => item.id === data.id));
        this.filter.setCustomSubscriptions([data]);
      }
      this.ref.markForCheck();
    })
    this.sub.add(onLeftPanelMarketingFilter);
    let geLefttFilter = this.usersStateService.getOnFilter().subscribe((data) => {
      this.filter.setIsArchive(data.isArchive);
    });
  }
  private checkCompanyCustomerUser() {
    this.filter = this.customerPortalStateService.getUsersFilters();
    let selectedCompany = this.companiesState.getCompanies().find(item => item.id == localStorage.getItem('company_info_id'));
    this.companiesDp.selectItemWithOutChanges(selectedCompany);
    this.companiesDp.isDisabled = true;
    this.ref.markForCheck();
  }
  applyFilters() {
    this.usersStateService.onInitFilter(this.filter);
  }
  onChangeDefaultSubscriptions(data) {
    this.filter.changeDefaultSubscriptions(data);
  }
  public onChangeTags(items) {
    console.log("data", items);
    this.filter.setTags(items.map(item => item.id));
  }
  onChangeCustomSubscription(data) {
    this.filter.setCustomSubscriptions(data);
    this.usersStateService.onInitFilter(this.filter);
  }
  public clearAll() {
    if (!this.companiesDp.isDisabled) {
      this.filter.setCompanies([]);
      this.companiesDp.clearWithOutChanges();
    }
    this.filter.setIsArchive(false);
    this.filter.setJobTitles([]);
    this.jobTitleDp.clearWithOutChanges();
    this.filter.resetDefaultSubscriptions();
    this.filter.setIndustries([]);
    this.industriesDp.clearWithOutChanges();
    this.filter.setTags([]);
    this.tagsDp.clearWithOutChanges();
    this.filter.setUserName(null);
    this.filter.setClientType(null);
    this.onClearAll.emit(null);
    this.usersStateService.onInitFilter(this.filter);
  }
  onSelectTitle(item, event) {
    if (!event.target.checked) {
      item.selected = false;
    } else {
      item.selected = true;
    }
    this.filter.setJobTitles(this.crmStateService.getJobTitleList().filter(title => title.selected).map(item => item.id));
  }
  public onSelectCompany(items) {
    this.filter.setCompanies(items.map(item => item.id));
  }
  public onSelectIndustry(items) {
    this.filter.setIndustries(items.map(item => item.id));
  }
  clearClientIndustry() {
    this.filter.setIndustries([]);
    this.usersStateService.onInitFilter(this.filter);
  }
  close() {
    this.onClose.emit(null);
  }
}
