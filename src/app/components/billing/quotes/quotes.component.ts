import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';

/**
 * Password quotes component
 */
@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],

})
export class QuotesComponent implements OnInit, OnDestroy {
  invoiceId: string;
  sub: Subscription = new Subscription();
  // showPreviewInvoice: boolean = false;
  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private quoteStateService: QuoteStateService,
    private invoiceStateService: InvoiceStateService,
  ) {
  }


  /**
   * Initializes quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.leftPanelStateService.setBillingPage('quotes-component');
    let getOnInvoice = this.quoteStateService.getOnInvoice().subscribe(data => {
      this.invoiceId = data;
      this.invoiceStateService.togglePreview(data);
      //   this.showPreviewInvoice = true;
    })
    this.sub.add(getOnInvoice);

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
