import { Component, ViewChild } from '@angular/core';
import { LeftPanelSettingsComponent } from '../../left-panel/left-panel-settings/left-panel-settings.component';
import { LeftPanelCustomerPortalUsersComponent } from './left-panel-customer-portal-users/left-panel-customer-portal-users.component';
import { LeftPanelComponent } from '../../left-panel/left-panel.component';

@Component({
  selector: 'left-panel-customer-portal',
  templateUrl: './left-panel-customer-portal.component.html',
  styleUrls: ['./left-panel-customer-portal.component.scss']
})
export class LeftPanelCustomerPortalComponent extends LeftPanelComponent {


  @ViewChild('panelCompanyInfo', { static: true }) panelCompanyInfo: LeftPanelCustomerPortalUsersComponent;
  @ViewChild('panelSettings', { static: true }) panelSettings: LeftPanelSettingsComponent;

  public isShowSettingsPage() {
    return this.currentUser && this.currentUser.customerCompaniesInfo.find(item => item.customerUserRole && item.customerUserRole.getPermission('VIEW_MY_PROFILE'));
  }

}