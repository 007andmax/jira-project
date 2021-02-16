import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
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
  /**
   * Creates an instance of the LeftPanelComponent with the injected services
   * @param {QuoteStateService} quoteStateService Service to work with quote
   */
  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private permissionsService: PermissionsService,
  ) { }


  /**
   * Initializes quote service. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.activePage = this.leftPanelStateService.activePage;
    console.log("activePage", this.activePage);
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
      console.log("activePage", this.activePage);
      console.log("this.open", this.open);
    })
  }
  isBillingState(state) {
    return (state === 'billing-dashboard'
      || state === 'new-services'
      || state === 'new-billable'
      || state === 'new-billable-invoices'
      || state === 'quotes-component'
      || state === 'new-payments-ng2'
      || state === 'new-contracts')
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
