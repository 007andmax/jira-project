import { EventEmitter, Inject, Injectable } from '@angular/core';

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

  constructor(
    @Inject('$state') $state: any
  ) {
    this.state = $state;
  }

  public setClient(client) {
    this.client = client;
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

  public goToState(state) {
    this.state.go(state);
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
  }

  public setTotalTaxes(value) {
    this.totalTaxes = value;
  }

  public setTotal(value) {
    this.total = value;
  }

  public setSubTotalServices(value) {
    this.subTotalServices = value;
  }

}
