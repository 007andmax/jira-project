import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuoteStateService {

  public client: any;
  public itemsArray: any;
  public type = false;
  public validateForm: EventEmitter<any> = new EventEmitter();
  public quoteNumber: number;

  constructor() { }

  public setClient(client) {
    this.client = client;
  }

  public getClient() {
    return this.client;
  }

  public getPrice(cost, count, tax) {
    return tax ? (((tax.rate)/100)*cost + cost)  * count : cost  * count;
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

  public getQuotenumber(value) {
    return this.quoteNumber;
  }

}
