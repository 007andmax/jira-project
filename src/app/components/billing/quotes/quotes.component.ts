
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { fadeInAnimation } from 'src/app/animations';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { QuoteAsideAddComponent } from './quote-aside-add/quote-aside-add.component';
import { QuoteAsideEditComponent } from './quote-aside-edit/quote-aside-edit.component';
import { QuotesTableComponent } from './quotes-table/quotes-table.component';

/**
 * Password quotes component
 */
@Component({
  standalone: true,
  imports: [QuoteAsideAddComponent, QuoteAsideEditComponent, QuotesTableComponent, CommonModule],
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./quotes.component.scss'],
  standalone: true,
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
