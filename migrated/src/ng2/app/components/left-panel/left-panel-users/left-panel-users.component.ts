import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { FilterListTop } from 'src/ng2/class/list/filter-list-top';
import { UserFilter } from '../../users/class/user-filter';
import { LeftPanelUsersService } from './services/left-panel-users.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { LeftPanelService } from 'src/ng2/app/services/left-panel/left-panel.service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';

@Component({
  selector: 'app-left-panel-users',
  templateUrl: './left-panel-users.component.html',
  styleUrls: ['./left-panel-users.component.scss'],
  providers: [LeftPanelUsersService]
})
export class LeftPanelUsersComponent implements OnInit, OnDestroy {

  showArchivedCompanies: boolean = false;
  filter: UserFilter = new UserFilter();
  allTitles: Array<string> = [];
  industries = [];
  industryHistory = [];
  companiesHistory = [];
  selectedClientIndustry: string = null;
  selectedCompany: string = null;
  clientIndustry: string = '';
  companies = [];
  constructor(private usersStateService: UsersStateService, private leftPanelUsersService: LeftPanelUsersService,
    private companiesState: CompaniesStateService, private leftPanelService: LeftPanelService, private companiesService: CompaniesService) { }

  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0) this.getUsersTitle(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getUsersTitle(data);
    })
    this.leftPanelUsersService.addSubscription(getOnUsers);
    this.industries = this.companiesState.getIndustries();
    this.leftPanelService.getIndustryHistoryUsers().subscribe((data: Array<string>) => {
      console.log('data', data);
      this.industryHistory = data;
    })
    this.leftPanelService.getCompaniesHistory().subscribe((data: Array<string>) => {
      console.log('data', data);
      this.companiesHistory = data;
    })
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {

      this.getClientsList(data);
    })
    this.leftPanelUsersService.addSubscription(getOnCompanies);
  }
  public onSelectCompany(item) {
    if (!item) {
      this.clearSelectedCompany();
      return;
    }
    this.selectedCompany = null;
    console.log('item',item);
    this.filter.setCompany(item.id);
    this.usersStateService.onInitFilter(this.filter);
    this.companiesHistory.pop();
    this.companiesHistory.unshift(item.name);
    //this.company.techLeadId = this.listPersons[index].id;

    this.companiesService.setСustomStorage("userPageFilterByCompanyHistory", this.companiesHistory).subscribe(data => {

    })

  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && ((!this.showArchivedCompanies) ? !item.deletedAt : item.deletedAt));
  }
  toggleFilter(event) {
    event.target.parentNode.classList.toggle('show-filter');
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
      }, []);

  }
  public onSelectClientIndustry(item) {
    if (!item) {
      this.clearSelectedCompany();
      return;
    }
    this.selectedClientIndustry = null;

    //   this.showClearIndustry = true;
    this.clientIndustry = item;
    this.filter.setClientIndustry(this.clientIndustry);
    this.usersStateService.onInitFilter(this.filter);
    this.industryHistory.pop();
    this.industryHistory.unshift(item);
    //this.company.techLeadId = this.listPersons[index].id;

    this.companiesService.setСustomStorage("userPageFilterByIndustryHistory", this.industryHistory).subscribe(data => {

    })
  }
  public selectClientIndustry(item) {
    this.selectedClientIndustry = item;
    //  this.showClearIndustry = true;
    this.clientIndustry = item;
    this.filter.setClientIndustry(this.clientIndustry);
    this.usersStateService.onInitFilter(this.filter);
  }
  selectClientCompany(item) {
    console.log('item',item);
    this.selectedCompany = item;
    let indexCompany = this.companiesState.getCompanies().findIndex(company => company.name === item);
    //  this.showClearIndustry = true;
    // this.clientIndustry = item;
    console.log('this.companiesState.getCompanies()[indexCompany].id',this.companiesState.getCompanies()[indexCompany].id);
    this.filter.setCompany(this.companiesState.getCompanies()[indexCompany].id);
    this.usersStateService.onInitFilter(this.filter);
  }
  clearClientIndustry() {
    //  this.showClearIndustry = false;
    this.clientIndustry = '';
    this.filter.setClientIndustry(null);
    this.usersStateService.onInitFilter(this.filter);
  }
  clearSelectedCompany() {
    //  this.showClearIndustry = false;
    //this.selectedCompany = '';
    this.filter.setCompany(null);
    this.usersStateService.onInitFilter(this.filter);
  }
  onSelectTitle(data) {
    console.log('onSelectTitle', data);
    this.filter.setTitle(data);
    this.usersStateService.onInitFilter(this.filter);
  }
  onSetFilterClientType(data) {
    //   this.calculateCount.onCulculateCurrent(data);
    // this.companiesState.setCalculateCount(this.calculateCount);
    this.filter.setClientType(data);
    this.usersStateService.onInitFilter(this.filter);
  }
  onShowAll() {
    this.filter.setClientType(null);
    this.usersStateService.setOnShowArchived(false);
    this.showArchivedCompanies = false;
  }
  onShowArchived() {
    this.usersStateService.setOnShowArchived(true);
    this.showArchivedCompanies = true;
  }
  ngOnDestroy(): void {
    this.leftPanelUsersService.onUnsubscribe();
  }
}
