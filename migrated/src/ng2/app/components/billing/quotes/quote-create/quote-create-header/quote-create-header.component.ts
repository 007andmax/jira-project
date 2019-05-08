import { Component, EventEmitter, Output } from '@angular/core';

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

  constructor() { }

  /**
   * Emit save quotes to QuoteCreate component
   */
  public saveQuotes() {
    this.saveAndContinue.next();
  }

}
