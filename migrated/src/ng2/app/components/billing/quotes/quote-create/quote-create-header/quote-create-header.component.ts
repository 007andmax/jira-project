import { Component, EventEmitter, Output } from '@angular/core';
import { QuoteStateService } from "../quote-state.service";

/**
 * Password quotes header component
 */
@Component({
  selector: 'app-quote-create-header',
  templateUrl: './quote-create-header.component.html',
  styleUrls: ['./quote-create-header.component.scss']
})
export class QuoteCreateHeaderComponent {

  @Output() saveAndContinue = new EventEmitter<string>();
  @Output() approve = new EventEmitter<string>();
  @Output() toInvoice = new EventEmitter<string>();
  @Output() toTicket = new EventEmitter<string>();

  constructor(
    private quoteStateService: QuoteStateService
  ) { }

  /**
   * Emit save quotes to QuoteCreate component
   */
  public saveQuotes() {
    this.saveAndContinue.next();
  }

  /**
   * Emit approve quotes to QuoteCreate component
   */
  public approveQuote() {
    this.approve.next();
  }

  /**
   * Emit convert to invoice to QuoteCreate component
   */
  public convertToInvoice() {
    this.toInvoice.next();
  }

  /**
   * Emit convert to ticket to QuoteCreate component
   */
  public convertToTicket() {
    this.toTicket.next();
  }

  /**
   * go to quotes list
   */
  public returnToQuotes() {
    this.quoteStateService.goToQuote();
  }

}
