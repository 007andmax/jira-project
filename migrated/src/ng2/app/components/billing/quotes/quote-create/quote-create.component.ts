import { Component, OnInit, ViewChild } from '@angular/core';
import { QuoteCreateContentComponent } from "./quote-create-content/quote-create-content.component";

/**
 * Password quotes create component
 */
@Component({
  selector: 'app-quote-create',
  templateUrl: './quote-create.component.html',
  styleUrls: ['./quote-create.component.scss']
})
export class QuoteCreateComponent {

  @ViewChild(QuoteCreateContentComponent) quoteCreateContentComponent:QuoteCreateContentComponent;

  constructor() { }

  /**
   * Create quote and save
   */
  public saveAndContinue() {
    this.quoteCreateContentComponent.saveAndContinue();

  }

}
