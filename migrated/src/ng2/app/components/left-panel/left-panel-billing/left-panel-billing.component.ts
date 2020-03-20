import { Component, OnInit } from '@angular/core';
import { QuoteStateService } from "../../billing/quotes/quote-create/quote-state.service";

/**
 * Left panel billing component
 */
@Component({
  selector: 'app-left-panel-billing',
  templateUrl: './left-panel-billing.component.html',
  styleUrls: ['./left-panel-billing.component.scss']
})
export class LeftPanelBillingComponent implements OnInit {

  /**
   * Creates an instance of the LeftPanelComponent with the injected services
   * @param {QuoteStateService} quoteStateService Service to work with quote
   */
  constructor(
    private quoteStateService: QuoteStateService
  ) { }

  /**
   * Initializes quote service. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() { }

  /**
   * Filter by password types
   * * @param state - state to go
   */
  public goToState(state) {
    this.quoteStateService.goToState(state);
  }

}
