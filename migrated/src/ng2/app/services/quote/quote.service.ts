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
  private offset = 30;
  private quoteNumber = 'QUOTE_NUMBER_DESC';
  private customerName = 'CUSTOMER_NAME_DESC';
  private date = 'DATE_DESC';
  private validUntil = 'VALID_UNTIL_DESC';
  private amount = 'AMOUNT_DESC';
  private deposit = 'DEPOSIT_DESC';
  private sortType = null;

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

  getQuotes(data) {
    data.type && this.getSortType(data.type);
    return this.http.post(this.apiUrl + 'saleQuotes/search', {
      "companyName": data.company,
      "quoteNumber": null,
      "status": null,
      "date": data.startDate || '',
      "endDate": data.endDate || '',
      "sortBy": this.sortType || 'DATE_DESC',
      "offset": this.offset * data.page,
      "limit": this.offset
    })
  }

  getSortType(type) {
    console.log(type, 'TYPe');
    switch (type) {
      case 'number':
        this.sortType = this.quoteNumber === 'QUOTE_NUMBER_ASC' ? 'QUOTE_NUMBER_DESC' : 'QUOTE_NUMBER_ASC';
        this.quoteNumber = this.sortType;
        break;
      case 'customerName':
        this.sortType = this.customerName === 'CUSTOMER_NAME_DESC' ? 'CUSTOMER_NAME_ASC' : 'CUSTOMER_NAME_DESC';
        this.customerName = this.sortType;
        break;
      case 'date':
        this.sortType = this.date === 'DATE_DESC' ? 'DATE_ASC' : 'DATE_DESC';
        this.date = this.sortType;
        break;
      case 'validUntil':
        this.sortType = this.validUntil === 'VALID_UNTIL_DESC' ? 'VALID_UNTIL_ASC' : 'VALID_UNTIL_DESC';
        this.validUntil = this.sortType;
        break;
      case 'amount':
        this.sortType = this.amount === 'AMOUNT_DESC' ? 'AMOUNT_ASC' : 'AMOUNT_DESC';
        this.amount = this.sortType;
        break;
      case 'deposit':
        this.sortType = this.deposit === 'DEPOSIT_DESC' ? 'DEPOSIT_ASC' : 'DEPOSIT_DESC';
        this.deposit = this.sortType;
        break;
    }
  }


}
