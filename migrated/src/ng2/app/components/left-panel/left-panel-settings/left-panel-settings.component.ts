import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ActivationStart, NavigationEnd } from '@angular/router';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { SettingStateService } from 'src/ng2/app/states/setting/setting-state.service';

@Component({
  selector: 'app-left-panel-settings',
  templateUrl: './left-panel-settings.component.html',
  styleUrls: ['./left-panel-settings.component.scss']
})
export class LeftPanelSettingsComponent implements OnInit {
  active: boolean = false;
  componentName: string;
  currentUser: CurrentUser;
  constructor(private permissionsService: PermissionsService,
    private settingStateService: SettingStateService,
    private usersStateService: UsersStateService) {
  }

  ngOnInit() {
    this.componentName = this.settingStateService.getComponentName();
    this.currentUser = this.usersStateService.getCurrentUser();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
