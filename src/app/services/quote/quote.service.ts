import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Quote } from '../../components/billing/quotes/class/quote';
import { QuoteStateService } from '../../states/quote/quote-state.service';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';


/**
 * Quote service to work with api
 */
@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private apiUrl = environment.apiUrl;

  /**
   * Product api service constructor
   * @param {HttpClient} http Service to work with request
   * @param {QuoteStateService} quoteStateService  Service to work with quote state
   */
  constructor(
    private http: HttpClient,
    private quoteStateService: QuoteStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService

  ) { }

  /**
   * Create quote
   * @param value - quote info
   * @param notification - quote notification info
   */
  public createQuote(data, notification) {
    return this.http.post(`${this.apiUrl}saleQuotes`, data).pipe(
      tap(data => {
        this.toastrService.success("The new quote has been successfully saved");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  /**
   * Edit quote
   * @param value - quote info
   * @param quoteId - quote id
   * @param notification - quote notification info
   */
  public editQuote(data) {
    return this.http.put(`${this.apiUrl}saleQuotes/${data.id}`, data).pipe(
      tap(data => {
        this.toastrService.success("The quote has been successfully saved");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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
   * Get services list
   * @param clientCompanyId - client company id
   */
  public getServiceList(clientCompanyId) {
    return this.http.get(this.apiUrl + `services/${clientCompanyId}`).pipe(
      tap(data => data),
      catchError(this.handleError));
  }

  /**
   * Get quote object
   * @param data - quote info
   */
  public getQuotes(data) {
    return this.http.post(this.apiUrl + 'saleQuotes/search', data).pipe(
      map((data: any) => data.map(item => new Quote(item))),
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
      tap(data => {
        this.toastrService.success("The quote has been successfully approved");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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

  public convertToBillable(company, quote_id) {
    return this.http.post(this.apiUrl +
      `saleQuotes/convertToBillableItem?companyId=${company.id}`, [quote_id]
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

  /**
   * check error
   * @param error - error
   */
  private handleError = (error) => {
    let err = error.error;
    return throwError(error);
  }
}
