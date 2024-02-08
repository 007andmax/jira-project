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

@Component({
  selector: 'app-users-filter',
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFilterComponent implements OnInit {
  @ViewChild('titlesDp') titlesDp: DropDownComponent;
  @ViewChild('companiesDp') companiesDp: TicketsFilterCompaniesDropDownComponent;
  @ViewChild('industriesDp') industriesDp: DropDownComponent;
  @ViewChild('subscriptionDp') subscriptionDp: UsersFilterSubscriptionsComponent;
  @ViewChild('tagsDp') tagsDp: CompanyTagsComponent;
  industries: Array<CrmCompanyIndustry> = [];
  public filter: UserFilters = new UserFilters();
  sub: Subscription = new Subscription();
  @Output() changeCountFilter = new EventEmitter<any>();
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
      this.onChangeCounterFilter();
      this.ref.markForCheck();
    })
    this.sub.add(onLeftPanelMarketingFilter);
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
    this.onChangeCounterFilter();
  }
  onChangeDefaultSubscriptions(data) {
    this.filter.changeDefaultSubscriptions(data);
  }
  public onChangeTags(data) {
    this.filter.setTags(data);
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  onChangeCustomSubscription(data) {
    this.filter.setCustomSubscriptions(data);
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  public onClearAll() {

    if (!this.companiesDp.isDisabled) this.filter.setCompanies([]);
    this.filter.setIndustries([]);
    this.filter.setJobTitles([]);
    this.filter.changeDefaultSubscriptions(new UserDefaultSubscription(null));
    this.filter.defaultSubscriptions.clearEnabledAll();
    this.filter.setCustomSubscriptions([]);
    this.filter.setTags([]);
    this.titlesDp.clearWithOutChanges();
    this.industriesDp.clearWithOutChanges();
    this.subscriptionDp.clearWithOutChanges();
    this.tagsDp.clearWithOutChanges();
    if (!this.companiesDp.isDisabled) this.companiesDp.clearWithOutChanges();
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();

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
  public onSelectClientIndustry(item) {
    if (!item) {
      this.clearClientIndustry();
      return;
    }
    this.filter.setIndustries(item);
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();

  }
  clearClientIndustry() {
    this.filter.setIndustries([]);
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  public onChangeCounterFilter() {
    let count = 0;
    if (this.filter.jobTitles.length > 0) count++;
    if (this.filter.companies.length > 0) count++;
    if (this.filter.industries.length > 0) count++;
    if (this.filter.tags.length > 0) count++;
    if (this.filter.customSubscriptions.length > 0) count++;
    this.changeCountFilter.emit(count);
    this.ref.detectChanges();
  }
}
