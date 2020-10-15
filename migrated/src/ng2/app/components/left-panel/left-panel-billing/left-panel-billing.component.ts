import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';
import { QuoteStateService } from "../../billing/quotes/quote-create/quote-state.service";

/**
 * Left panel billing component
 */
@Component({
  selector: 'app-left-panel-billing',
  templateUrl: './left-panel-billing.component.html',
  styleUrls: ['./left-panel-billing.component.scss']
})
export class LeftPanelBillingComponent implements OnInit, OnDestroy {

  activePage: string = "new-billable";
  sub: Subscription = new Subscription();
  /**
   * Creates an instance of the LeftPanelComponent with the injected services
   * @param {QuoteStateService} quoteStateService Service to work with quote
   */
  constructor(
    private quoteStateService: QuoteStateService,
    private leftPanelStateService: LeftPanelStateService
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
  }

  /**
   * Filter by password types
   * * @param state - state to go
   */
  public goToState(state) {
    this.activePage = state;
    this.quoteStateService.goToState(state);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
