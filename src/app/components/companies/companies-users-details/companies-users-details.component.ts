import { Component, OnInit } from '@angular/core';
import { UsersDetailsComponent } from '../../users-details/users-details.component';
import { UserCustomerCompaniesInfo } from '../../users/class/user-customer-companies-info';
import { UserCustomSubscription } from '../../users/class/user-custom-subscription';

@Component({
    selector: 'app-companies-users-details',
    templateUrl: './companies-users-details.component.html',
    styleUrls: ['./companies-users-details.component.scss'],
    standalone: true
})
export class CompaniesUsersDetailsComponent extends UsersDetailsComponent {
  companyId: string;

  ngOnInit() {
    this.leftPanelStateService.changeStateWithoutNavigate('company-user-details');
    let id = this.activateRoute.snapshot.params['iduser'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      id = params['iduser'];
      this.companyId = params['id'];
      this.companiesStateService.setCompanyRoutingId(params['id']);
      if (this.usersStateService.getAllUsers().length > 0 && this.activateRoute.snapshot.params['iduser']) this.setUserRoutingId(this.activateRoute.snapshot.params['iduser']);
    });
    this.sub.add(subscription);
    let onGetUsers = this.usersStateService.onGetUsers.subscribe(ata => {
      if (this.usersStateService.getAllUsers().length > 0 && this.activateRoute.snapshot.params['iduser']) this.setUserRoutingId(this.activateRoute.snapshot.params['iduser']);
    })
    this.sub.add(onGetUsers);
    if (!this.customerRoleStateService.isGetUserRole) this.customerRoleStateService.onInitGetUsersRoles();
    this.getColors();
    setTimeout(() => {

      let stompClient = this.usersRealTimeService.changeSubscriptionsUsers.subscribe(newChange => {
        if (newChange.action === 'DEFAULT_SUBSCRIPTION_SAVED') {
          if (this.user.id == newChange.data.userId) {
            let index = this.user.customerCompaniesInfo.findIndex(item => item.companyId === newChange.data.companyId);
            if (index > -1) this.user.customerCompaniesInfo[index] = new UserCustomerCompaniesInfo(newChange.data);
          }
          this.cd.detectChanges();
        }
        if (newChange.action === 'CUSTOM_SUBSCRIPTION_SAVED') {
          if (this.user.id == newChange.data.userId) this.user.changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
          this.cd.detectChanges();
        }
      });
      this.sub.add(stompClient);
    }, 3000);
    this.usersStateService.onShowAddCustomerCompaniesInfo.subscribe(data => {
      this.tab = 'companies';
    })
  }

}
