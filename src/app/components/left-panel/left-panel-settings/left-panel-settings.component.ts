import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-left-panel-settings',
    templateUrl: './left-panel-settings.component.html',
    styleUrls: ['./left-panel-settings.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf]
})
export class LeftPanelSettingsComponent implements OnInit, OnDestroy {
  open: boolean = false;
  active: boolean = false;
  currentUser: CurrentUser;
  sub: Subscription = new Subscription();
  @Input() componentName: string;
  @Input() activePage: string = "";
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private permissionsService: PermissionsService,
    private settingStateService: SettingStateService,
    private leftPanelStateService: LeftPanelStateService,
    private leftPanelService: LeftPanelService,
    public companiesStateService: CompaniesStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private usersStateService: UsersStateService) {
  }


  ngOnInit() {
    this.componentName = this.settingStateService.getComponentName();
    this.currentUser = this.usersStateService.getCurrentUser();
    let onToggleLeftPanel = this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.sub.add(onToggleLeftPanel);
    let onChangeState = this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.leftPanelService.isSettingsPage(state)) this.open = false
    })
    this.sub.add(onChangeState);
    let onFirstOpen = this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.leftPanelService.isSettingsPage(data)) this.open = true;
    })
    this.sub.add(onFirstOpen);
  }
  public close() {
    this.open = false;
  }
  public isSettingsPage(state) {
    return (state === 'myprofile-component'
      || state === 'manage-tags-component'
      || state === 'products-settings'
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
      || state === 'subscription-component'
      || state === 'device-setting-component'
      || state === 'ticket-settings'
      || state === 'crm-settings'
      || state === 'marketing-email'
      || state === 'device-setting-component'
      || state === 'customer-portal')
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
