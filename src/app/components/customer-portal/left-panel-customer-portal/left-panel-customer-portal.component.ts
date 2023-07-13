import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/interfaces/company/company';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { LeftPanelBillingComponent } from '../../left-panel/left-panel-billing/left-panel-billing.component';
import { LeftPanelCompaniesComponent } from '../../left-panel/left-panel-companies/left-panel-companies.component';
import { LeftPanelDevicesComponent } from '../../left-panel/left-panel-devices/left-panel-devices.component';
import { LeftPanelDocumentsComponent } from '../../left-panel/left-panel-documents/left-panel-documents.component';
import { LeftPanelInventoryComponent } from '../../left-panel/left-panel-inventory/left-panel-inventory.component';
import { LeftPanelMarketingComponent } from '../../left-panel/left-panel-marketing/left-panel-marketing.component';
import { LeftPanelPasswordManagerComponent } from '../../left-panel/left-panel-password-manager/left-panel-password-manager.component';
import { LeftPanelSettingsComponent } from '../../left-panel/left-panel-settings/left-panel-settings.component';
import { LeftPanelSupportComponent } from '../../left-panel/left-panel-support/left-panel-support.component';
import { LeftPanelTicketsComponent } from '../../left-panel/left-panel-tickets/left-panel-tickets.component';
import { LeftPanelUsersComponent } from '../../left-panel/left-panel-users/left-panel-users.component';
import { TicketStateService } from '../../tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { User } from '../../users/class/user';
import { CurrentUser } from 'src/class/current-user/current-user';
import { LeftPanelCustomerPortalUsersComponent } from './left-panel-customer-portal-users/left-panel-customer-portal-users.component';
import { LeftPanelComponent } from '../../left-panel/left-panel.component';

@Component({
  selector: 'left-panel-customer-portal',
  templateUrl: './left-panel-customer-portal.component.html',
  styleUrls: ['./left-panel-customer-portal.component.scss']
})
export class LeftPanelCustomerPortalComponent extends LeftPanelComponent {


  @ViewChild('panelCompanyInfo') panelCompanyInfo: LeftPanelCustomerPortalUsersComponent;
  @ViewChild('panelSettings') panelSettings: LeftPanelSettingsComponent;

  public isShowSettingsPage() {
    return this.currentUser && this.currentUser.customerCompaniesInfo.find(item => item.customerUserRole && item.customerUserRole.getPermission('VIEW_MY_PROFILE'));
  }

}