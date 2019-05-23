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

  constructor(
    private quoteStateService: QuoteStateService
  ) { }

  /**
   * Emit save quotes to QuoteCreate component
   */
  public saveQuotes() {
    this.saveAndContinue.next();
  }

  public returnToQuotes() {
    this.quoteStateService.goToQuote();
  }

}
