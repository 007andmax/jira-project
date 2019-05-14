import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import {QuoteStateService} from "../../components/billing/quotes/quote-create/quote-state.service";

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private apiUrl = environment.apiUrl;
  private itemsListArray = [];
  private productsArray = [];
  private servicesArray = [];

  constructor(
    private http: HttpClient,
    private quoteStateService: QuoteStateService
  ) {}

   public createQuote(value) {
    this.itemsListArray = this.quoteStateService.getItemArray();
    this.productsArray = this.getProductItems(this.itemsListArray, 'product');
    this.servicesArray = this.getProductItems(this.itemsListArray, 'service');
    return this.http.post(`${this.apiUrl}saleQuotes?sendNotification=true` ,{
       "companyId": value.client.item.id,
       "number": this.quoteStateService.getQuoteNumber(),
       "quoteItems":{
       "type":"MIXED",
         "shares":[],
         "ticket":null,
         "products": this.productsArray,
         "services": this.servicesArray
     },
       "requestPayment":false,
       "draft":false,
       "purchaseOrder":"Some string",
       "partialDeposit":"Partial deposit String",
       "validUntil": this.getMsDate(value.endDate),
       "date": this.getMsDate(value.startDate),
       "recipients":["user@gmail.com"],
       "message":"My message string with styles",
       "globalNote": value.globalNote,
       "regularNote": value.regularNote || null
    })
  }

  getQuoteNumber() {
    return this.http.get(this.apiUrl + `data/actualNumber?type=SALE_QUOTE`)
  }

  getQuoteNote() {
    return this.http.get(this.apiUrl + `invoice/invoiceNote/getAll`);
  }

  getMsDate(value) {
    const date = new Date(`${value.year}/${value.month}/${value.day}` );
    return date.getTime()
  }

  getServiceList(clientCompanyId) {
    return this.http.get(this.apiUrl + `services/${clientCompanyId}`);
  }

  getProductItems(itemsAray, type) {
    if (type === 'service') {
      itemsAray = itemsAray.filter((item) => item.hasOwnProperty('rate'));
      return itemsAray.map((item, index) => ({
        item: item,
        "itemOrder": index,
        "quantity": 1,
        "discountType":"PERCENT"
      }))
    } else {
      itemsAray = itemsAray.filter((item) => !item.hasOwnProperty('rate'));
      return itemsAray.map((item, index) => ({
        item: item,
        "itemOrder": index,
        "quantity": item.quantity,
        "discountType":"PERCENT"
      }))
    }


  }


}
