import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { QuoteStateService } from "../../quote-state.service";
import {QuoteService} from "../../../../../../services/quote/quote.service";

/**
 *  Quotes create content top component
 */
@Component({
  selector: 'app-quote-create-content-top',
  templateUrl: './quote-create-content-top.component.html',
  styleUrls: ['./quote-create-content-top.component.scss']
})
export class QuoteCreateContentTopComponent {

  @Output() selectedItem = new EventEmitter<any>();
  @Input() quoteForm: FormGroup;
  public quoteNumber: number;

  constructor(
    private quoteStateService: QuoteStateService,
    private quoteService: QuoteService
  ) {
    this.getQuoteNumber();
  }

  /**
   * Emit selected client to parent
   * @params selected Client
   */
  public selectClient(selectClient) {
    this.selectedItem.next(selectClient);
    this.quoteStateService.setClient(selectClient);
  }

  /**
   * Get free quotes number
   */
  private getQuoteNumber() {
    this.quoteService.getQuoteNumber().subscribe((res) => {
      this.quoteNumber = res['number'];
    });
  }

}
