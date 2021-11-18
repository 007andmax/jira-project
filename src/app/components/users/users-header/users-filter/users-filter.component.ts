import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CrmCompanyIndustry } from 'src/app/components/setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { CompanyIndustry } from 'src/app/interfaces/company/company-industry';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { UserFilter } from '../../class/user-filter';

@Component({
  selector: 'app-users-filter',
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.scss']
})
export class UsersFilterComponent implements OnInit {
  @ViewChild('titlesDp') titlesDp: DropDownComponent;
  @ViewChild('companiesDp') companiesDp: DropDownComponent;
  @ViewChild('industriesDp') industriesDp: DropDownComponent;
  companies = [];
  industries: Array<CrmCompanyIndustry> = [];
  allTitles: Array<string> = [];
  public filter: UserFilter = new UserFilter();
  sub: Subscription = new Subscription();
  @Output() changeCountFilter = new EventEmitter<any>();
  constructor(private companiesState: CompaniesStateService,
    private crmStateService: CrmStateService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    this.allTitles = this.crmStateService.getJobTitleList().map(item => item.name);
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.allTitles = data.map(item => item.name);
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
  }

  public onClearAll() {

    if (!this.companiesDp.isDisabled) this.filter.setCompany(null);
    this.filter.setClientIndustry(null);
    this.filter.setTitle(null);
    this.titlesDp.clearWithOutChanges();
    this.industriesDp.clearWithOutChanges();

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
    this.changeCountFilter.emit(count);
  }
}
