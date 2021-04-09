import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';
import { QuoteStateService } from 'src/ng2/app/states/quote/quote-state.service';

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
      if (!this.isBillingState(state)) this.open = false;
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.isBillingState(data)) this.open = true;
    })
    let getOnShowNotificationReview = this.contractsStateService.getOnShowNotificationReview().subscribe(data => {
      this.showNotificationReview = true;
    })
    this.sub.add(getOnShowNotificationReview);
  }
  isBillingState(state) {
    return (state === 'billing-dashboard'
      || state === 'new-services'
      || state === 'new-billable'
      || state === 'new-billable-tickets'
      || state === 'new-billable-invoices'
      || state === 'quotes-component'
      || state === 'new-payments-ng2'
      || state === 'new-contracts')
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
