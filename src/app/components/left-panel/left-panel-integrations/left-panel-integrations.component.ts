import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { RightClickBlankDirective } from '../../../directives/right-click-blank/right-click-blank.directive';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-left-panel-integrations',
    templateUrl: './left-panel-integrations.component.html',
    styleUrls: ['./left-panel-integrations.component.scss'],
    standalone: true,
    imports: [NgClass, RightClickBlankDirective]
})
export class LeftPanelIntegrationsComponent {
  open: boolean = false;
  @Input() activePage: string = "";
  sub: Subscription = new Subscription();
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  showNotificationReview: boolean = false;
  /**
   * Creates an instance of the LeftPanelComponent with the injected services
   * @param {QuoteStateService} quoteStateService Service to work with quote
   */
  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private permissionsService: PermissionsService,
    public contractsStateService: ContractsStateService,
    private leftPanelService: LeftPanelService,
    public customerPortalStateService: CustomerPortalStateService,
    private usersStateService: UsersStateService,
  ) { }


  /**
   * Initializes quote service. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.activePage = this.leftPanelStateService.activePage;

    let onToggleLeftPanel = this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.sub.add(onToggleLeftPanel);
    let onChangeState = this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.leftPanelService.isBillingState(state)) this.open = false;
    })
    this.sub.add(onChangeState);
    let onFirstOpen = this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.leftPanelService.isBillingState(data)) this.open = true;
    })
    this.sub.add(onFirstOpen);

  }
  public getCompanyInfoPermissions(action) {
    return (this.usersStateService.getCurrentUser() && this.usersStateService.getCurrentUser().accountType == "CLIENT" && this.usersStateService.getCurrentUser().customerCompaniesInfo.some(compnayInfo => compnayInfo.customerUserRole.getPermission(action)));
  }
  public close() {
    this.open = false;
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  /**
   * Filter by password types
   * * @param state - state to go
   */
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
