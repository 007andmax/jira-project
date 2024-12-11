import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UserProfile } from '../../users/class/user-profile';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Subscription } from 'rxjs';
import { UsersDetailsTabCompaniesItemComponent } from './users-details-tab-companies-item/users-details-tab-companies-item.component';

@Component({
  selector: 'app-users-details-tab-companies',
  templateUrl: './users-details-tab-companies.component.html',
  styleUrls: ['./users-details-tab-companies.component.scss']
})
export class UsersDetailsTabCompaniesComponent implements OnInit, OnDestroy {
  sort = 'ASC';
  maxSubscribes: number = 0;
  maxPhoneNumbers: number = 0;
  @Input() user: UserProfile = new UserProfile();
  selectAll: boolean = false;
  isShowAdd: boolean = false;
  sub: Subscription = new Subscription();
  constructor(public usersStateService: UsersStateService,
    private usersService: UsersService,
    public cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    if (this.usersStateService.isShowAddCustomerCompaniesInfo) {
      this.isShowAdd = true;
      this.usersStateService.setIsShowAddCustomerCompaniesInfo(false);
    }
    let onShowAddCustomerCompaniesInfo = this.usersStateService.onShowAddCustomerCompaniesInfo.subscribe(data => {
      this.isShowAdd = true;
      this.usersStateService.setIsShowAddCustomerCompaniesInfo(false);
    })
    this.sub.add(onShowAddCustomerCompaniesInfo);
  }
  updateUser() {
    this.usersService.updateUser(this.user.getUserForUpdate(this.usersStateService.getuserForEdit())).subscribe(data => {

    })
  }
  ngDoCheck() {
    this.maxSubscribes = Math.max(...this.user.customerCompaniesInfo.map(item => item.getCountDefaultSubscriptions()));
  }
  sortCompanies() {
    if (this.sort == 'DESC') {
      this.sort = 'ASC';
      this.user.customerCompaniesInfo.sort((a, b) => (a.clientCompanyName.toLowerCase() > b.clientCompanyName.toLowerCase()) ?
        1 : ((b.clientCompanyName.toLowerCase() > a.clientCompanyName.toLowerCase()) ? -1 : 0));
    } else {
      this.sort = 'DESC';
      this.user.customerCompaniesInfo.reverse();
    }
    this.cd.detectChanges();
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
  public trackByCompanyId(index, item) {
    return item.companyId;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
