import { EventEmitter, Inject, Injectable } from '@angular/core';
import { DateService } from "../../../../services/date/date.service";

@Injectable({
  providedIn: 'root'
})
export class QuoteStateService {

  public client: any;
  public itemsArray: any;
  public type = false;
  public validateForm: EventEmitter<any> = new EventEmitter();
  public quoteNumber: number;
  public state;
  public subTotalProducts = 0;
  public subTotalServices = 0;
  public totalTaxes = 0;
  public total = 0;
  public selectedNoteFull: any;
  public quoteForCreate = {
    startDate: '',
    endDate: '',
    quoteNumber: '',
    itemsArray: '',
    client: '',
    subTotalProducts: '',
    subTotalServices: '',
    totalTaxes: '',
    total: '',
    globalNote: '',
    selectedNote: '',
    partialDeposit: '',
    purchaseOrder: '',
    requestPayment: ''
  };


  constructor(
    @Inject('$state') $state: any,
    private dateService: DateService
  ) {
    this.state = $state;
  }

  public setClient(client) {
    this.client = client;
    this.quoteForCreate.client = client;
  }

  public getClient() {
    return this.client;
  }

  public getPrice(cost, count, tax) {
    let price = 0;
    if (tax && tax.rate) {
      price = ((count * cost) * (tax.rate)/100 + (cost * count));
    } else {
      price = cost  * count
    }
    return price;
  }

  public getTaxPrice(cost, count, tax) {
    return tax ? ((tax.rate)/100)*cost* count : 0;
  }

  public setItemArray(itemsArray) {
    this.itemsArray = itemsArray;
    this.quoteForCreate.itemsArray = itemsArray;
  }

  public getItemArray() {
    return this.itemsArray;
  }

  public setType(value) {
    this.type = value;
  }

  public getType() {
    return this.type;
  }

  public emitValidation() {
    this.validateForm.emit(this.type)
  }

  public setNumber(value) {
    this.quoteNumber = value;
    this.quoteForCreate.quoteNumber = value;
  }

  public getQuoteNumber() {
    return this.quoteNumber;
  }

  public goToCreate() {
    this.state.go('quote-create-component');
  }

  public goToQuote() {
    this.state.go('quotes-component');
  }

  public getState() {
    return this.state;
  }

  public goToState(state, params?) {
    this.state.go(state, params);
  }

  getQuote() {
    return ({
      quoteNumber: this.quoteNumber,
      itemsArray: this.itemsArray,
      client: this.client,
      subTotalProducts: this.subTotalProducts,
      subTotalServices: this.subTotalServices,
      totalTaxes: this.totalTaxes,
      total: this.total
    })
  }

  public setSubTotalProducts(value) {
    this.subTotalProducts = value;
    this.quoteForCreate.subTotalProducts = value;
  }

  public setTotalTaxes(value) {
    this.totalTaxes = value;
    this.quoteForCreate.totalTaxes = value;
  }

  public setTotal(value) {
    this.total = value;
    this.quoteForCreate.total = value;
  }

  public setSubTotalServices(value) {
    this.subTotalServices = value;
    this.quoteForCreate.subTotalServices = value;
  }

  public setStartDate(value) {
    this.quoteForCreate.startDate = value;
  }

  public setEndDate(value) {
    this.quoteForCreate.endDate = value;
  }

  getQuoteCreate() {
    return this.quoteForCreate;
  }

  public setGlobalNote(value) {
    this.quoteForCreate.globalNote = value;
  }

  public getGlobalNote() {
    return this.quoteForCreate.globalNote;
  }

  public setSelectedNote(value) {
    this.quoteForCreate.selectedNote = value;
  }

  public setSelectedNoteFull(value) {
      this.selectedNoteFull = value;
    }

  public getSelectedNote() {
    return this.selectedNoteFull;
  }

  public setPartialDeposit(value) {
    this.quoteForCreate.partialDeposit = value;
  }

  public getPartialDeposit() {
    return this.quoteForCreate.partialDeposit
  }

  public setPurchaseOrder(value) {
    this.quoteForCreate.purchaseOrder = value;
  }

  public getPurchaseOrder() {
    return this.quoteForCreate.purchaseOrder
  }

  public setRequestPayment(value) {
    this.quoteForCreate.requestPayment = value;
  }

  public getRequestPayment() {
    return this.quoteForCreate.requestPayment
  }

  public setEditQuote(quote) {
    this.quoteForCreate = quote;
    this.setClient(quote.company);
    const itemsArray = [...quote.ticket.updates[0].products, ...quote.ticket.updates[0].services];

    this.setItemArray(itemsArray);
    this.setNumber(quote.number);
    this.setEndDate(this.dateService.getStartDate(quote.date));
    this.setStartDate(this.dateService.getStartDate(quote.endDate));
    this.setGlobalNote(quote.globalNote);
    this.setSelectedNote(quote.regularNote);
    this.setPartialDeposit(quote.partialDeposit);
    this.setPurchaseOrder(quote.purchaseOrder);
    this.setRequestPayment(quote.requestPayment);
    this.goToState('quote-create-component', { editMode: true});
  }

}
