import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivationStart, NavigationEnd } from '@angular/router';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { SettingStateService } from 'src/ng2/app/states/setting/setting-state.service';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-left-panel-settings',
  templateUrl: './left-panel-settings.component.html',
  styleUrls: ['./left-panel-settings.component.scss']
})
export class LeftPanelSettingsComponent implements OnInit {
  open: boolean = false;
  active: boolean = false;
  componentName: string;
  currentUser: CurrentUser;
  @Input() activePage: string = "";
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private permissionsService: PermissionsService,
    private settingStateService: SettingStateService,
    private leftPanelStateService: LeftPanelStateService,
    private usersStateService: UsersStateService) {
  }

  ngOnInit() {
    this.componentName = this.settingStateService.getComponentName();
    this.currentUser = this.usersStateService.getCurrentUser();
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  public goToState(state) {
    this.onChangeState.emit(state);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
