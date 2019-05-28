import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { QuoteStateService } from "../../quote-state.service";
import { QuoteService } from "../../../../../../services/quote/quote.service";

/**
 *  Quotes create content top component
 */
@Component({
  selector: 'app-quote-create-content-top',
  templateUrl: './quote-create-content-top.component.html',
  styleUrls: ['./quote-create-content-top.component.scss']
})
export class QuoteCreateContentTopComponent implements OnInit {

  @Output() selectedItem = new EventEmitter<any>();
  @Input() quoteForm: FormGroup;
  public quoteNumber: number;

  constructor(
    private quoteStateService: QuoteStateService,
    private quoteService: QuoteService
  ) {
    this.getQuoteNumber();
  }

  ngOnInit() {
    this.startDateChanges(this.quoteForm.value.startDate);
    this.endDateChanges(this.quoteForm.value.endDate);
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

  /**
   * Follow quote number change
   */
  private setNumber(value) {
    this.quoteStateService.setNumber(value)
  }

  /**
   * Emit selected start date to quoteState
   * @params selected date
   */
  public startDateChanges(value) {
    console.log(value);
    this.quoteStateService.setStartDate(value)
  }

  /**
   * Emit selected end date to quoteState
   * @params selected date
   */
  public endDateChanges(value) {
    console.log(value);
    this.quoteStateService.setEndDate(value)
  }



}
