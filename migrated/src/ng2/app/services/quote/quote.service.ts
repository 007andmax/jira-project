import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { QuoteStateService } from "../../components/billing/quotes/quote-create/quote-state.service";
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { QuoteResult } from '../../components/billing/quotes/class/quote-result';
import { NotificationStateService } from '../../components/shared/notification/services/notification-state.service';
 

/**
 * Quote service to work with api
 */
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


  /**
   * Product api service constructor
   * @param {HttpClient} http Service to work with request
   * @param {QuoteStateService} quoteStateService  Service to work with quote state
   */
  constructor(
    private http: HttpClient,
    private quoteStateService: QuoteStateService,
    private notificationStateService:NotificationStateService
    
  ) { }

  /**
   * Create quote
   * @param value - quote info
   * @param notification - quote notification info
   */
  public createQuote(value, notification) {
    this.itemsListArray = this.quoteStateService.getItemArray();
    this.productsArray = this.getProductItems(this.itemsListArray, 'product');
    this.servicesArray = this.getProductItems(this.itemsListArray, 'service', true);
     
    return this.http.post(`${this.apiUrl}saleQuotes`, {
      "companyId": (value.client && value.client.item) ? value.client.item.id : value.client.id,
      "number": this.quoteStateService.getQuoteNumber(),
      "quoteItems": {
        "type": "MIXED",
        "shares": [],
        "ticket": null,
        "products": this.productsArray,
        "services": this.servicesArray
      },
      "description" : this.quoteStateService.getDescription(),
      "requestPayment": this.quoteStateService.getRequestPayment() ? this.quoteStateService.getRequestPayment() : false,
      "draft": false,
      "purchaseOrder": this.quoteStateService.getPurchaseOrder() || null,
      "partialDeposit": this.quoteStateService.getPartialDeposit() || null,
      "validUntil": this.getMsDate(value.endDate),
      "date": this.getMsDate(value.startDate),
      "recipients": this.quoteStateService.getUsersEmail() ? this.quoteStateService.getUsersEmail() : [],
      "message": notification ? this.quoteStateService.getQuoteCreate()['message'] : null,
      "subject": notification ? this.quoteStateService.getQuoteCreate()['subject'] : null,
      "globalNote": value.globalNote ? value.globalNote : this.quoteStateService.getGlobalNote(),
      "regularNote":  this.quoteStateService.getSelectedNote() ? this.quoteStateService.getSelectedNote() : (value.selectedNote !== '') ? this.quoteStateService.getRegularNote(value.selectedNote) : null,
      "sendNotification": notification
    }).pipe(
      tap(data => this.handleQuoteSent(data, (notification) ? 'Quote has been sent' : 'Quote has been saved')),
      catchError(this.handleError));
  }

  /**
   * Edit quote
   * @param value - quote info
   * @param quoteId - quote id
   * @param notification - quote notification info
   */
  public editQuote(value, quoteId, notification) {
    this.itemsListArray = this.quoteStateService.getItemArray();
    this.productsArray = this.getProductItems(this.itemsListArray, 'product');
    this.servicesArray = this.getProductItems(this.itemsListArray, 'service', true);
     
    return this.http.put(`${this.apiUrl}saleQuotes/${quoteId}`, {
      "companyId": (value.client && value.client.item) ? value.client.item.id : value.client.id,
      "number": this.quoteStateService.getQuoteNumber(),
      "id": quoteId,
      "quoteItems": {
        "type": "MIXED",
        "shares": [],
        "ticket": null,
        "products": this.productsArray,
        "services": this.servicesArray
      },
      "description" : this.quoteStateService.getDescription(),
      "requestPayment": this.quoteStateService.getRequestPayment() ? this.quoteStateService.getRequestPayment() : false,
      "draft": false,
      "purchaseOrder": this.quoteStateService.getPurchaseOrder() || null,
      "partialDeposit": this.quoteStateService.getPartialDeposit() || null,
      "validUntil": this.getMsDate(value.endDate),
      "date": this.getMsDate(value.startDate),
      "recipients": this.quoteStateService.getUsersEmail() ? this.quoteStateService.getUsersEmail() : [],
      "message": notification ? this.quoteStateService.getQuoteCreate()['message'] : null,
      "subject": notification ? this.quoteStateService.getQuoteCreate()['subject'] : null,
      "globalNote": value.globalNote ? value.globalNote : this.quoteStateService.getGlobalNote(),
      "regularNote":  this.quoteStateService.getSelectedNote() ? this.quoteStateService.getSelectedNote() : (value.selectedNote !== '') ? this.quoteStateService.getRegularNote(value.selectedNote) : null,
      "sendNotification": notification
    }).pipe(
      tap(data => this.handleQuoteSent(data, 'Quote has been saved')),
      catchError(this.handleError));
  }

  /**
   * Resend quote
   * @param item - item list
   * @param recipients - users list
   */
  public resend(item, recipients) {
    this.productsArray = this.getProductItems([...item.products], 'product');
    this.servicesArray = this.getProductItems([...item.services], 'service');
    return this.http.put(`${this.apiUrl}saleQuotes/${item.id}`, {
      "companyId": item.company.id,
      "number": item.number,
      "id": item.id,
      "quoteItems": {
        "type": "MIXED",
        "shares": [],
        "ticket": null,
        "products": this.productsArray,
        "services": this.servicesArray,
      },
      "requestPayment": item.requestPayment,
      "draft": false,
      "purchaseOrder": item.purchaseOrder,
      "partialDeposit": item.partialDeposit,
      "validUntil": item.validUntil,
      "date": item.date,
      "recipients": recipients,
      "message": item.message,
      "subject": item.subject,
      "globalNote": item.globalNote,
      "regularNote": item.regularNote,
      "sendNotification": true
    }).pipe(
      tap(data => this.handleQuoteSent(data, 'Quote has been sent')),
      catchError(this.handleError));
  }

  /**
   * Repaet send
   * @param quoteId - quote Id
   */
  public repeatSend(quoteId) {
    return this.http.post(`${this.apiUrl}saleQuotes/${quoteId}/send`, {}).pipe(
      tap(data => data),
      catchError(this.handleError));
  }

  /**
   * Get quote number
   */
  public getQuoteNumber() {
    return this.http.get(this.apiUrl + `data/actualNumber?type=SALE_QUOTE`).pipe(
      tap(data => data),
      catchError(this.handleError));
  }

    /**
   * Get quote note
   */
  public getQuote(id) {
    return this.http.get(this.apiUrl + `saleQuotes/${id}`).pipe(
      tap(data => data),
      catchError(this.handleError));
  }


  /**
   * Get quote note
   */
  public getQuoteNote() {
    return this.http.get(this.apiUrl + `invoice/invoiceNote/getAll`).pipe(
      tap(data => data),
      catchError(this.handleError));
  }

  /**
   * Get time in ms
   */
  public getMsDate(value) {
    const date = new Date(`${value.year}/${value.month}/${value.day}`);
    return date.getTime()
  }

  /**
   * Get services list
   * @param clientCompanyId - client company id
   */
  public getServiceList(clientCompanyId) {
    return this.http.get(this.apiUrl + `services/${clientCompanyId}`).pipe(
      tap(data => data),
      catchError(this.handleError));
  }

  /**
   * Get product items by type
   * @param itemsAray - items array
   * @param type - item type
   * @param onInitSaveOrCreate - onInitSaveOrCreate
   */
  public getProductItems(itemsAray, type, onInitSaveOrCreate = false) {
    if (type === 'service') {
      itemsAray = itemsAray.filter((item) => item.hasOwnProperty('rate'));
      return itemsAray.map((item, index) => {
        let quantity = JSON.parse(JSON.stringify(item.quantity));
        let description = "";
        try {
          description = JSON.parse(JSON.stringify(item.description));
        } catch (error) {

        }
        if (onInitSaveOrCreate) {
          item.quantity = '1';
          delete item.description;
        }
        return {
          item: item,
          "itemOrder": index,
          "quantity": quantity,
          "discountType": "PERCENT",
          "description": description
        }
      })
    } else {
      itemsAray = itemsAray.filter((item) => !item.hasOwnProperty('rate'));
      return itemsAray.map((item, index) => ({
        item: item,
        "itemOrder": index,
        "quantity": item.quantity,
        "discountType": "PERCENT"
      }))
    }
  }

  /**
   * Get quote object
   * @param data - quote info
   */
  public getQuotes(data) {
    //data.type && this.getSortType(data.type);
    
    return this.http.post(this.apiUrl + 'saleQuotes/search', {
      "companyName": data.company || null,
      "quoteNumber": data.number || null,
      "status": data.status || null,
      "date": data.startDate || '',
      "endDate": data.endDate || '',
      "sortBy": this.sortType || 'DATE_DESC',
      "offset": this.offset * data.page,
      "limit": this.offset
    }).pipe(
      tap(data => data),
      catchError(this.handleError));
  }

  /**
   * Convert quote to invoice
   * @param company - company info
   * @param quote_id - quote id
   */
  public convertToInvoice(company, quote_id) {
    return this.http.post(this.apiUrl +
      `saleQuotes/convertToInvoice?companyId=${company.companyInfo.id}
      &billTo=${company.companyInfo.addresses[0].id}
      &shipTo=${company.companyInfo.addresses[0].id}`,
      [quote_id]).pipe(
        tap(data => data),
        catchError(this.handleError));
  }

  /**
   * Convert quote to ticket
   * @param company - company info
   * @param quote_id - quote id
   */
  public convertToTicket(company, quote_id) {
    return this.http.post(this.apiUrl +
      `saleQuotes/convertToTicket?companyId=${company.id}`,
      [quote_id]).pipe(
        tap(data => data),
        catchError(this.handleError));
  }

  /**
   * Approve quote
   * @param company - company info
   * @param quoteId - quote id
   */
  public approveQuote(company, quoteId) {
    return this.http.post(this.apiUrl +
      `saleQuotes/approveQuote?companyId=${company.id}`, [quoteId]
    ).pipe(
      tap(data => this.handleQuoteSent(data, 'Quote has been approved')),
      catchError(this.handleError));
  }

  /**
   * cancel quote
   * @param company - company info
   * @param quote_id - quote id
   */
  public cancelQuote(company, quote_id) {
    return this.http.post(this.apiUrl +
      `saleQuotes/cancelQuote?companyId=${company.id}`, [quote_id]
    ).pipe(
      tap(data => data),
      catchError(this.handleError));
  }

  /**
   * Archive quote
   * @param company - company info
   * @param quote_id - quote id
   */
  public archiveQuote(company, quote_id) {
    return this.http.post(this.apiUrl +
      `saleQuotes/archiveQuote?companyId=${company.id}`, [quote_id]
    ).pipe(
      tap(data => data),
      catchError(this.handleError));
  }

  /**
   * Mark quote as read
   * @param company - company info
   * @param quote_id - quote id
   */
  public markAsRead(company, quote_id) {
    return this.http.post(this.apiUrl +
      `saleQuotes/${quote_id}/markAsRead?companyId=${company.id}`, {}
    ).pipe(
      tap(data => data),
      catchError(this.handleError));
  }

  /**
   * Download quote information in pdf
   * @param quote_id - quote id
   */
  public downloadPdf(quote_id) {
    return this.http.get(this.apiUrl + `saleQuotes/${quote_id}/pdf`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf',
      }), responseType: 'blob'
    }).pipe(
      tap(data => data),
      catchError(this.handleError));
  }

  /**
  * Method is use to download file.
  * @param res - Array Buffer data
  * @param id - type of the document.
  */
  public downLoadFile(res: any, id, companyName, quoteNumber) {
    
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    const data = window.URL.createObjectURL(res);
    var link = document.createElement('a');
    link.href = data;
    //   link.download=`${this.apiUrl}saleQuotes/${id}/pdf.pdf`;
    if (isFirefox) {
      link.href = `${window.location.origin}/saleQuotes/${id}/pdf`;
      link.target = "_blank";
    } else {
      link.download = `${companyName}_Quote-${quoteNumber}.pdf`;
    }
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);
    
  }

  public backToQuoteList() {
    this.quoteStateService.goToQuote();
  }

  /**
   * Get sort type
   * @param type - type of sort
   */
  public getSortType(type) {
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
  /**
   * check error
   * @param error - error
   */
  private handleError = (error) => {
    let err = error.error;
    this.quoteStateService.setError((err.validationResults && err.validationResults.saleQuotePostDto) ? err.validationResults.saleQuotePostDto : err.message);
    return throwError(error);
  }

  private handleQuoteSent = (data, message) => {
    this.notificationStateService.oninitShowNotification(message);
    // this.quoteStateService.setQuoteResult(message);
    // this.quoteStateService.setHandleQuoteHasSent();
    return data;
  }

  public setDefaultTypes() {
    this.offset = 30;
    this.quoteNumber = 'QUOTE_NUMBER_DESC';
    this.customerName = 'CUSTOMER_NAME_DESC';
    this.date = 'DATE_DESC';
    this.validUntil = 'VALID_UNTIL_DESC';
    this.amount = 'AMOUNT_DESC';
    this.deposit = 'DEPOSIT_DESC';
    this.sortType = null;
  }

}
