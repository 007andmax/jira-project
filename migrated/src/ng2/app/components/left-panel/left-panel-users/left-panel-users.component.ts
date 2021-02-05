import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
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
  open: boolean = false;
  showArchivedCompanies: boolean = false;
  filter: UserFilter = new UserFilter();
  allTitles: Array<string> = [];
  industries = [];
  industryHistory = [];
  companiesHistory = [];
  selectedClientIndustry: string = null;
  selectedCompany: any = null;
  //  clientIndustry: string = '';
  companies = [];
  @Input() activePage: string = "";
  @Output() onChangeState = new EventEmitter();
  @Output() onGoToLink = new EventEmitter();
  constructor(private usersStateService: UsersStateService,
    private leftPanelUsersService: LeftPanelUsersService,
    public cd: ChangeDetectorRef,
    private companiesState: CompaniesStateService,
    private leftPanelService: LeftPanelService,
    private companiesService: CompaniesService) { }

  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0) this.getUsersTitle(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getUsersTitle(data);
    })
    this.leftPanelUsersService.addSubscription(getOnUsers);
    this.industries = this.companiesState.getIndustries();
    this.leftPanelService.getIndustryHistoryUsers().subscribe((data: Array<string>) => {

      this.industryHistory = data;
    })
    this.leftPanelService.getCompaniesHistory().subscribe((data: Array<string>) => {

      this.companiesHistory = data;
    })
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {

      this.getClientsList(data);
    })
    this.leftPanelUsersService.addSubscription(getOnCompanies);
  }
  closeMobileFilter() {
    document.body.querySelector('app-left-panel-users').classList.remove('show');
  }
  public goToState() {
    // this.activePage = state;

    this.onChangeState.emit('new-users');

  }
  public onSelectCompany(item) {
    if (!item) {
      this.clearSelectedCompany();
      return;
    }
    this.selectedCompany = null;
    this.filter.setCompany(item.id);
    this.usersStateService.onInitFilter(this.filter);
    this.companiesHistory.pop();
    this.companiesHistory.unshift(item.name);
    this.companiesService.setСustomStorage("userPageFilterByCompanyHistory", this.companiesHistory).subscribe(data => {
    })
  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && ((!this.showArchivedCompanies) ? !item.deletedAt : item.deletedAt)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
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
      }, []).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
        1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));

  }
  public onSelectClientIndustry(item) {
    if (!item) {
      this.clearClientIndustry();
      return;
    }
    this.selectedClientIndustry = null;
    this.filter.setClientIndustry(item);
    this.usersStateService.onInitFilter(this.filter);
    this.industryHistory.pop();
    this.industryHistory.unshift(item);
    this.companiesService.setСustomStorage("userPageFilterByIndustryHistory", this.industryHistory).subscribe(data => {
    })
  }
  public selectClientIndustry(item) {
    this.selectedClientIndustry = item;
    this.filter.setClientIndustry(item);
    this.usersStateService.onInitFilter(this.filter);
    this.cd.detectChanges();
  }
  selectClientCompany(item) {
    let indexCompany = this.companiesState.getCompanies().findIndex(company => company.name === item);
    this.selectedCompany = this.companiesState.getCompanies()[indexCompany];
    this.filter.setCompany(this.companiesState.getCompanies()[indexCompany].id);
    this.usersStateService.onInitFilter(this.filter);
  }
  clearClientIndustry() {
    this.selectedClientIndustry = null;
    this.filter.setClientIndustry(null);
    this.usersStateService.onInitFilter(this.filter);
  }
  clearSelectedCompany() {
    this.selectedCompany = null;
    this.filter.setCompany(null);
    this.usersStateService.onInitFilter(this.filter);
  }
  onSelectTitle(data) {
    this.filter.setTitle(data);
    this.usersStateService.onInitFilter(this.filter);
  }
  onSetFilterClientType(data) {
    this.filter.setClientType(data);
    this.usersStateService.onInitFilter(this.filter);
  }
  onShowAll() {
    this.filter.setClientType(null);
    this.usersStateService.setOnShowArchived(false);
    this.showArchivedCompanies = false;
    this.usersStateService.setShowArchivedCompanies(false);
  }
  onShowArchived() {
    this.filter.setClientType(null);
    this.usersStateService.setOnShowArchived(true);
    this.showArchivedCompanies = true;
    this.usersStateService.setShowArchivedCompanies(true);
  }
  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.leftPanelUsersService.onUnsubscribe();
  }
}
