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
  public editItem: any;
  public editMode: any;

  constructor(
    private quoteStateService: QuoteStateService,
    private quoteService: QuoteService
  ) {
    this.getQuoteNumber();
  }

  ngOnInit() {
    this.startDateChanges(this.quoteForm.value.startDate);
    this.endDateChanges(this.quoteForm.value.endDate);
    this.getState();
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
      this.quoteNumber = this.editMode ? this.quoteStateService.getQuoteNumber() : res['number'];
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
    this.quoteStateService.setStartDate(value)
  }

  /**
   * Emit selected end date to quoteState
   * @params selected date
   */
  public endDateChanges(value) {
    this.quoteStateService.setEndDate(value)
  }

  /**
   * get mode state
   */
  public getState() {
    this.editMode = this.quoteStateService.getState().params.editMode;
    if (this.editMode) {
      this.editItem = this.quoteStateService.getClient();
    }
  }

}
