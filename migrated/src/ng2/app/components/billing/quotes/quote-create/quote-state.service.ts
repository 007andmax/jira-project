import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuoteStateService {

  public client: any;
  public itemsArray: any;

  constructor() { }

  public setClient(client) {
    this.client = client;
  }

  public getClient() {
    return this.client;
  }

  public getPrice(cost, count) {
    return cost * count
  }

  public setItemArray(itemsArray) {
    this.itemsArray = itemsArray;
  }

  public getItemArray(itemsArray) {
    return this.itemsArray;
  }

}
