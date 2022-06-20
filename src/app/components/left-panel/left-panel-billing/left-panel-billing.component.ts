import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';

/**
 * Left panel billing component
 */
@Component({
  selector: 'app-left-panel-billing',
  templateUrl: './left-panel-billing.component.html',
  styleUrls: ['./left-panel-billing.component.scss']
})
export class LeftPanelBillingComponent implements OnInit, OnDestroy {
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
  ) { }


  /**
   * Initializes quote service. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.activePage = this.leftPanelStateService.activePage;
    let getOnBillingPage = this.leftPanelStateService.getOnBillingPage().subscribe(data => {
      this.activePage = data;
    })
    this.sub.add(getOnBillingPage);
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.leftPanelService.isBillingState(state)) this.open = false;
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.leftPanelService.isBillingState(data)) this.open = true;
    })
    let getOnShowNotificationReview = this.contractsStateService.getOnShowNotificationReview().subscribe(data => {
      this.showNotificationReview = true;
    })
    this.sub.add(getOnShowNotificationReview);
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
