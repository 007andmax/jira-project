import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UserProfile } from '../../users/class/user-profile';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-users-details-tab-companies',
  templateUrl: './users-details-tab-companies.component.html',
  styleUrls: ['./users-details-tab-companies.component.scss']
})
export class UsersDetailsTabCompaniesComponent implements OnInit {
  @Input() user: UserProfile = new UserProfile();
  selectAll: boolean = false;
  isShowAdd: boolean = false;
  constructor(public usersStateService: UsersStateService,
    private usersService: UsersService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.usersStateService.onShowAddCustomerCompaniesInfo.subscribe(data => {
      this.isShowAdd = true;
    })
  }
  updateUser() {
    this.usersService.updateUser(this.user.getUserForUpdate(this.usersStateService.getuserForEdit())).subscribe(data => {

    })
  }
  toggleAllUser(event) {
    this.selectAll = event.target.checked;
    this.user.customerCompaniesInfo.forEach(item => {
      item.selected = event.target.checked;
    })
    this.onSelectCustomerCompaniesInfo();
    this.cd.detectChanges();
  }
  onSelectCustomerCompaniesInfo() {
    this.usersStateService.setSelectedCustomerCompaniesInfo(this.user.customerCompaniesInfo.filter(item => item.selected));
  }
}
