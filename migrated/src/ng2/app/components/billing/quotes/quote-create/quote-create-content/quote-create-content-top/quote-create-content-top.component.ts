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
  public errorMessage: string = null;
  public description: string = '';

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
    this.onInitErrorHandle();
    if (this.editMode) {
      this.currentClient = this.quoteStateService.getClient();
       
      this.getServices();
    }
  }

  /**
  * Initialized error handle.
  */
  public onInitErrorHandle() {
    this.quoteStateService.getErrorHandle().subscribe((data) => {
      this.errorMessage = data;
    })
  }

  onChangeDescription(event) {

    this.quoteStateService.setDescription(event.target.value);
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
    this.getServices();
    this.cd.detectChanges();
  }

  public getServices() {
    this.quoteService.getServiceList(this.currentClient.id).subscribe((res: any) => {
      this.quoteStateService.onInitServices(res);
      this.quoteStateService.setServices(res);
    });
  }

  /**
   * Get free quotes number
   */
  private getQuoteNumber() {
    this.quoteService.getQuoteNumber().subscribe((res) => {
      this.quoteNumber = this.editMode ? this.quoteStateService.getQuoteNumber() : (res['number']) ? res['number'] : 1;
      this.startQuoteNumber = this.editMode ? this.quoteStateService.getQuoteNumber() : (res['number']) ? res['number'] : 1;
    });
  }

  /**
   * Follow quote number change
   */
  public setNumber(value) {
    this.quoteStateService.setNumber(value);
    this.quoteStateService.setError(null);
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

      this.description = this.quoteStateService.getDescription();
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

  /**
   * set client company
   * @param items - list clients
   */
  public setClients(items) {
    if (this.editItem) {
      let index: number = items.findIndex(item => item.id === this.editItem.id);
      if (index > (-1)) {
        this.currentClient = items[index];
      }
    }
  }
}
