import { Component, OnInit } from '@angular/core';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { FilterListTop } from 'src/ng2/class/list/filter-list-top';
import { UserFilter } from '../../users/class/user-filter';

@Component({
  selector: 'app-left-panel-users',
  templateUrl: './left-panel-users.component.html',
  styleUrls: ['./left-panel-users.component.scss']
})
export class LeftPanelUsersComponent implements OnInit {
  showArchivedCompanies:boolean  = false;
  filter:UserFilter = new UserFilter();
  constructor(private usersStateService:UsersStateService) { }

  ngOnInit() {
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
}
