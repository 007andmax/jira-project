import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { SuperAdminPublicStateService } from 'src/app/states/super-admin-public/super-admin-public-state.service';
import { Company } from '../../interfaces/company/company';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { NonContractServicesStateService } from '../../states/non-contract-services/non-contract-services-state.service';
import { InventoryStateService } from '../../states/inventory/inventory-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { TicketsStateService } from '../../states/tickets/tickets-state.service';
import { UsersStateService } from '../../states/users/users-state.service';
import { User } from '../users/class/user';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { Subscription } from 'rxjs';
import { NotificationsStateService } from 'src/app/states/notifications/notifications-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentCompany: Company;
  currentUser: User;
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    private ticketsStateService: TicketsStateService,
    private inventoryStateService: InventoryStateService,
    private nonContractServicesStateService: NonContractServicesStateService,
    private leftPanelStateService: LeftPanelStateService,
    public cd: ChangeDetectorRef,
    private superAdminPublicStateService: SuperAdminPublicStateService,
    private permissionsService: PermissionsService,
    public customerPortalStateService: CustomerPortalStateService,
    private notificationsStateService: NotificationsStateService,
    public companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) this.getCurrentUser(this.usersStateService.getCurrentUser());
    let getOnGetCurrentuser = this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.getCurrentUser(data)
    })
    this.sub.add(getOnGetCurrentuser);
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    let getOnCurrentCompany = this.companiesStateService.getOnCurrentCompany().subscribe(data => {
      this.currentCompany = this.companiesStateService.getCurrentCompany();
    })
    this.sub.add(getOnCurrentCompany);
  }
  private getCurrentUser(data) {
    this.currentUser = data;
  }
  showNotifications() {
    this.notificationsStateService.showNotifications();
  }
  goToSettings() {
    this.leftPanelStateService.goToState('myprofile-component');
  }
  checkLogo() {
    if (this.currentUser && this.currentUser.avatar) return `/users/${this.currentUser.id}/image.jpg?t=${this.currentUser.avatar.updatedAt}`;
    return null;
  }
  onAddTicket() {
    this.ticketsStateService.onToggleAddTicket();
  }
  onAddUser() {
    this.usersStateService.onOpenAsige();
  }
  onAddCompany() {
    this.companiesStateService.toggleAsideForAdd();
  }
  onAddService() {
    this.nonContractServicesStateService.toggleAsideForAdd();
  }
  onAddProduct() {
    this.inventoryStateService.toggleAsideForAdd();
  }
  public goToState(state) {

    //this.quoteStateService.goToState(state);
  }
  public logOut() {
    window.location.href = '/logout';
    window.location.hash = '';
  }
  public getCurrentUserName() {
    let user = this.usersStateService.getCurrentUser();
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  showHelpCanterAside() {
    this.superAdminPublicStateService.showAside();
  }
}
