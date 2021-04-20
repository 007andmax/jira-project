import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ActivationStart, NavigationEnd } from '@angular/router';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-left-panel-settings',
  templateUrl: './left-panel-settings.component.html',
  styleUrls: ['./left-panel-settings.component.scss']
})
export class LeftPanelSettingsComponent implements OnInit {
  open: boolean = false;
  active: boolean = false;
  currentUser: CurrentUser;
  @Input() componentName: string;
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
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.isSettingsPage(state)) this.open = false
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.isSettingsPage(data)) this.open = true;
    })
  }
  public close() {
    this.open = false;
  }
  public isSettingsPage(state) {
    return (state === 'myprofile-component'
      || state === 'manage-tags-component'
      || state === 'glnumber-component'
      || state === 'company-profile-component'
      || state === 'tech-component'
      || state === 'email-setting-component'
      || state === 'taxes-component'
      || state === 'permission-manage-component'
      || state === 'email-templete-component'
      || state === 'integrations-component'
      || state === 'invoice-ticket-component'
      || state === 'commission-component'
      || state === 'subscription-component')
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
