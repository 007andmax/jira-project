import { Component, OnInit, ViewChild } from '@angular/core';
import { QuoteCreateContentComponent } from "./quote-create-content/quote-create-content.component";
import { QuoteStateService } from "./quote-state.service";

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
  public editMode = false;

  constructor(
    private quoteStateService: QuoteStateService
  ) {
    this.getState();
  }

  /**
   * Create quote and save
   */
  public saveAndContinue() {
    this.quoteCreateContentComponent.saveAndContinue();
  }

  /**
   * Create quote and approve
   */
  public approve() {
    this.quoteCreateContentComponent.approveQuote();
  }

  /**
   * Create quote and convert to invoice
   */
  public toInvoice() {
    this.quoteCreateContentComponent.convertToInvoice();
  }

  /**
   * Create quote and convert to ticket
   */
  public toTicket() {
    this.quoteCreateContentComponent.convertToTicket();
  }

  /**
   * Create quote and download pdf
   */
  public download() {
    this.quoteCreateContentComponent.downloadPdf();
  }

  public getState() {
    this.editMode = this.quoteStateService.getState().params.editMode;
    console.log(this.editMode, 'editMode');
  }

}
