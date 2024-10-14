import { Component, Input, OnInit } from '@angular/core';
import { UserProfile } from '../../users/class/user-profile';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-users-details-left-panel',
  templateUrl: './users-details-left-panel.component.html',
  styleUrls: ['./users-details-left-panel.component.scss'],
  providers: [TicketsListService]
})
export class UsersDetailsLeftPanelComponent implements OnInit {
  companyId: string;
  @Input() user: UserProfile = new UserProfile();
  constructor(public customerPortalStateService: CustomerPortalStateService,
    private companiesStateService: CompaniesStateService,
    private permissionsService: PermissionsService,
    public usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,) { }

  ngOnInit() {
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  isPrimaryContact() {
    if (!this.customerPortalStateService.isCustomerPortal && this.companyId) return this.user.customerCompaniesInfo.find(item => item.companyId === this.companyId).isPrimaryContact;
    if (this.customerPortalStateService.isCustomerPortal && this.user.customerCompaniesInfo.find(item => item.companyId === localStorage.getItem('company_info_id'))) return this.user.customerCompaniesInfo.find(item => item.companyId === localStorage.getItem('company_info_id')).isPrimaryContact;
    return false
  }
}
