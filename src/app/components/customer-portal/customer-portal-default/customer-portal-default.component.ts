import { Component, OnInit } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';

@Component({
  selector: 'customer-portal-default',
  templateUrl: './customer-portal-default.component.html',
  styleUrls: ['./customer-portal-default.component.scss']
})
export class CustomerPortalDefaultComponent implements OnInit {
  currentUser: CurrentUser;
  noPermissions: boolean = true;
  constructor(private usersStateService: UsersStateService,) { }

  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) this.getCurrentUser(this.usersStateService.getCurrentUser());
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.getCurrentUser(data)
    })
  }
  getCurrentUser(data) {
    this.currentUser = data;
    this.currentUser.customerCompaniesInfo.forEach(item => {
      if (item.customerUserRole) {
        if (item.customerUserRole.getPermission('VIEW_ALL_TICKETS')) this.noPermissions = false;
        if (item.customerUserRole.getPermission('VIEW_ALL_INVOICES')) this.noPermissions = false;
        if (item.customerUserRole.getPermission('VIEW_MY_PROFILE')) this.noPermissions = false;
        if (item.customerUserRole.getPermission('VIEW_ALL_DEVICES')) this.noPermissions = false;
        if (item.customerUserRole.getPermission('VIEW_ALL_QUOTES')) this.noPermissions = false;
        if (item.customerUserRole.getPermission('VIEW_ALL_PAYMENTS')) this.noPermissions = false;
      }
    })
  }

}
