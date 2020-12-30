import { Component, OnInit } from '@angular/core';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';
import { QuoteStateService } from 'src/ng2/app/states/quote/quote-state.service';

/**
 * Password quotes component
 */
@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],

})
export class QuotesComponent implements OnInit {
  invoiceId: string;
  showPreviewInvoice: boolean = false;
  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private quoteStateService: QuoteStateService,
  ) {
  }

  /**
   * Initializes quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.leftPanelStateService.setBillingPage('quotes-component');
    this.quoteStateService.getOnInvoice().subscribe(data => {
      this.invoiceId = data;
      this.showPreviewInvoice = true;
    })

  }
}
