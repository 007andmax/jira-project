import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';
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
  public partialDeposit: any;
  public purchaseOrder: any;
  public requestPayment: any;
  public startQuoteNumber: number;
  public editItem: any;
  public editMode: any;
  public currentClient = null;

  /**
  *Creates an instance of the QuoteCreateContentTopComponent with the injected services
  * @param {QuoteService} quoteService to work with api
  * @param {QuoteStateService} quoteStateService to work quote state
  */
  constructor(
    private quoteStateService: QuoteStateService,
    private quoteService: QuoteService,
    public cd: ChangeDetectorRef
  ) {
    this.getQuoteNumber();
  }

  /**
   * Initializes quotes craete content top. See [ngOnInit]{@see OnInit#ngOnInit}
   */
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
    this.currentClient = selectClient.item;
    if (!this.editMode) this.quoteStateService.setCompany(selectClient);
    this.cd.detectChanges();
  }

  /**
   * Get free quotes number
   */
  private getQuoteNumber() {
    this.quoteService.getQuoteNumber().subscribe((res) => {
      this.quoteNumber = this.editMode ? this.quoteStateService.getQuoteNumber() : res['number'];
      this.startQuoteNumber = this.editMode ? this.quoteStateService.getQuoteNumber() : res['number'];
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
      //this.currentClient = this.quoteStateService.getClient();
      this.partialDeposit = this.quoteStateService.getPartialDeposit();
      this.purchaseOrder = this.quoteStateService.getPurchaseOrder();
      this.requestPayment = this.quoteStateService.getRequestPayment();
    }
  }

  /**
   * set partial deposit to state
   */
  public setPartialDeposit(value) {
    this.quoteStateService.setPartialDeposit(value);
  }

  /**
   * set purchase order to state
   */
  public setPurchaseOrder(value) {
    this.quoteStateService.setPurchaseOrder(value);
  }

  /**
   * set request payment to state
   */
  public setRequestPayment(value) {
    this.quoteStateService.setRequestPayment(value);
  }

  /**
   * return client company name
   */
  public getCLientUserName(companyInfo) {
    return `${companyInfo.contacts[0].firstName} ${companyInfo.contacts[0].lastName}`
  }

  /**
   * return client company address
   */
  public getCLientAddress(companyInfo) {
    return `${companyInfo.addresses[0].address}`
  }

  public getClients(items) {
    if (this.editItem) {
      let index: number = items.findIndex(item => item.id === this.editItem.id);
      if (index > (-1)) {
        this.currentClient = items[index];
      }
    }
  }
}
