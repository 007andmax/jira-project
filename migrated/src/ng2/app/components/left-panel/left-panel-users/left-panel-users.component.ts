import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { FilterListTop } from 'src/ng2/class/list/filter-list-top';
import { UserFilter } from '../../users/class/user-filter';
import { LeftPanelUsersService } from './services/left-panel-users.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';

@Component({
  selector: 'app-left-panel-users',
  templateUrl: './left-panel-users.component.html',
  styleUrls: ['./left-panel-users.component.scss'],
  providers: [LeftPanelUsersService]
})
export class LeftPanelUsersComponent implements OnInit, OnDestroy {
 
  showArchivedCompanies:boolean  = false;
  filter:UserFilter = new UserFilter();
  allTitles:Array<string> = [];
  industries = [];
  constructor(private usersStateService:UsersStateService, private leftPanelUsersService:LeftPanelUsersService,
    private companiesState:CompaniesStateService) { }

  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0)    this.getUsersTitle(this.usersStateService.getAllUsers());
    let getOnUsers =  this.usersStateService.getOnUsers().subscribe((data) => {
        this.getUsersTitle(data);
      })
      this.leftPanelUsersService.addSubscription(getOnUsers);
      this.industries = this.companiesState.getIndustries();
  }
  getUsersTitle (allUsers) {
    this.allTitles =  allUsers
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
  onSelectTitle(data) {
    console.log('onSelectTitle',data);
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
