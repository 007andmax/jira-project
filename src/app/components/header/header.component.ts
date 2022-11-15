import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { SuperAdminPublicStateService } from 'src/app/states/super-admin-public/super-admin-public-state.service';
import { Company } from '../../interfaces/company/company';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { DefaultServicesStateService } from '../../states/default-services/default-services-state.service';
import { InventoryStateService } from '../../states/inventory/inventory-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { QuoteStateService } from '../../states/quote/quote-state.service';
import { TicketsStateService } from '../../states/tickets/tickets-state.service';
import { UsersStateService } from '../../states/users/users-state.service';
import { User } from '../users/class/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentCompany: Company;
  toggleLeftPanel: boolean = false;
  currentUser: User;
  constructor(private usersStateService: UsersStateService,
    private ticketsStateService: TicketsStateService,
    // private quoteStateService: QuoteStateService,
    private inventoryStateService: InventoryStateService,
    private defaultServicesStateService: DefaultServicesStateService,
    private leftPanelStateService: LeftPanelStateService,
    public cd: ChangeDetectorRef,
    private superAdminPublicStateService: SuperAdminPublicStateService,
    private companiesService: CompaniesService,
    private permissionsService: PermissionsService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) this.getCurrentUser(this.usersStateService.getCurrentUser());
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.getCurrentUser(data)
    })
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      this.toggleLeftPanel = data;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.currentCompany = this.companiesStateService.getCurrentCompany();
    this.companiesStateService.getOnCurrentCompany().subscribe(data => {
      this.currentCompany = this.companiesStateService.getCurrentCompany();
    })
  }
  private getCurrentUser(data) {
    this.currentUser = data;
  }
  onToggleLeftPanel() {
    this.toggleLeftPanel = !this.toggleLeftPanel;
    this.leftPanelStateService.toggleLeftPanel(this.toggleLeftPanel);
  }
  goToSettings() {
    this.leftPanelStateService.goToState('myprofile-component');
    /*   let body = document.querySelector('.main-container');
       var link = document.createElement('a');
       body.appendChild(link);
       link.href = url;
       var e = document.createEvent('MouseEvents');
       e.initEvent('click', true, true);
       link.dispatchEvent(e);*/
  }
  checkLogo() {
    if (this.currentUser && this.currentUser.avatar) return `/users/${this.currentUser.id}/image.jpg?t=${this.currentUser.avatar.updatedAt}`;
    return null;
  }
  getCompanyLogoUrl() {
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo && this.currentCompany.logo.base64 && !this.currentCompany.logo.cropped) return this.currentCompany.logo.base64;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.cropped && this.currentCompany.logo.cropped.id) return `/file/${this.currentCompany.logo.cropped.id}`;
    if (this.currentCompany && this.currentCompany.logo && this.currentCompany.logo.origin && this.currentCompany.logo.origin.id) return `/file/${this.currentCompany.logo.origin.id}`;
    return '/company/default/logo.jpg';
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
    this.defaultServicesStateService.toggleAsideForAdd();
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
