import { Component, OnInit } from '@angular/core';
import { QuoteStateService } from "../../billing/quotes/quote-create/quote-state.service";

@Component({
  selector: 'app-left-panel-billing',
  templateUrl: './left-panel-billing.component.html',
  styleUrls: ['./left-panel-billing.component.scss']
})
export class LeftPanelBillingComponent implements OnInit {

  constructor(
    private quoteStateService: QuoteStateService
  ) { }

  ngOnInit() {
  }

  public goToState(state) {
    this.quoteStateService.goToState(state);
  }

}
