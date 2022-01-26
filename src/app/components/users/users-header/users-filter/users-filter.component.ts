import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-users-filter',
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.scss']
})
export class UsersFilterComponent implements OnInit {
  @ViewChild('titlesDp') titlesDp: DropDownComponent;
  @ViewChild('companiesDp') companiesDp: DropDownComponent;
  @ViewChild('industriesDp') industriesDp: DropDownComponent;
  @ViewChild('subscriptionDp') subscriptionDp: UsersFilterSubscriptionsComponent;
  @ViewChild('tagsDp') tagsDp: CompanyTagsComponent;
  companies = [];
  industries: Array<CrmCompanyIndustry> = [];
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  public filter: UserFilter = new UserFilter();
  sub: Subscription = new Subscription();
  @Output() changeCountFilter = new EventEmitter<any>();
  constructor(private companiesState: CompaniesStateService,
    private crmStateService: CrmStateService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    this.jobTitleList = this.crmStateService.getJobTitleList();
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.jobTitleList = data;
      if (this.titlesDp) this.titlesDp.reset(this.jobTitleList);
    })
    this.sub.add(onGetJobTitle);
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
    this.industries = this.crmStateService.getIndustryList();
    let onGetIndustry = this.crmStateService.onGetIndustry.subscribe(data => {
      this.industries = data;
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


    })
    this.sub.add(onLeftPanelMarketingFilter);
  }
  public onChangeTags(data) {
    this.filter.setTags(data);
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  public onChangeDefaultSubscription(data) {
    this.filter.setDefaultSubscriptions(data);
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  onChangeCustomSubscription(data) {
    this.filter.setCustomSubscriptions(data);
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  public onClearAll() {

    if (!this.companiesDp.isDisabled) this.filter.setCompany(null);
    this.filter.setClientIndustry(null);
    this.filter.setTitle(null);
    this.filter.setDefaultSubscriptions(null);
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
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  onSelectTitle(data) {
    this.filter.setTitle(data);
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  public onSelectCompany(item) {
    if (!item) {
      this.clearSelectedCompany();
      return;
    }

    this.filter.setCompany(item.id);
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  clearSelectedCompany() {
    this.filter.setCompany(null);
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  public onSelectClientIndustry(item) {
    if (!item) {
      this.clearClientIndustry();
      return;
    }
    this.filter.setClientIndustry(item);
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();

  }
  clearClientIndustry() {
    this.filter.setClientIndustry(null);
    this.usersStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
  }
  public onChangeCounterFilter() {
    let count = 0;
    if (this.filter.title) count++;
    if (this.filter.company) count++;
    if (this.filter.clientIndustry) count++;
    if (this.filter.defaultSubscriptions || this.filter.customSubscriptions.length > 0) count++;
    if (this.filter.tags.length > 0) count++;
    this.changeCountFilter.emit(count);
  }
}
