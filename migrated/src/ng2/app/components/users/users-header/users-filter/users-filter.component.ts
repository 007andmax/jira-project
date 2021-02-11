import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
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
  industries = [];
  allTitles: Array<string> = [];
  public filter: UserFilter = new UserFilter();
  sub: Subscription = new Subscription();
  @Output() changeCountFilter = new EventEmitter<any>();
  constructor(private companiesState: CompaniesStateService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0) this.getUsersTitle(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getUsersTitle(data);
    })
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
    this.industries = this.companiesState.getIndustries();
  }
  getUsersTitle(allUsers) {
    this.allTitles = allUsers
      .map((user) => {
        return user.designation;
      })
      .reduce((acc, title) => {
        let index = acc.findIndex((el) => {
          return (el || '').toLowerCase() === (title || '').toLowerCase();
        })

        if (index === -1 && title) {
          acc.push(title);
        }

        return acc;
      }, []).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
        1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));

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
