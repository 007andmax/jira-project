import { EventEmitter, Inject, Injectable } from '@angular/core';
import { QuotePreview } from '../../components/billing/quotes/class/quote-preview';

@Injectable({
  providedIn: 'root'
})
export class QuoteStateService {

  filter: EventEmitter<any> = new EventEmitter();
  onPreview: EventEmitter<any> = new EventEmitter();
  onEdit: EventEmitter<any> = new EventEmitter();
  onCopy: EventEmitter<any> = new EventEmitter();
  onCreate: EventEmitter<any> = new EventEmitter();
  onInvoice: EventEmitter<any> = new EventEmitter();
  quoteForCopy: QuotePreview;
  quoteForArchive: QuotePreview;
  public handleSendMode: EventEmitter<any> = new EventEmitter();
  public handleSendModeList: EventEmitter<any> = new EventEmitter();
  public handleSendModePreview: EventEmitter<any> = new EventEmitter();
  public handleSendModeEdit: EventEmitter<any> = new EventEmitter();
  public state;
  public usersEmail: any;

  constructor(

  ) {

  }
  public setQuoteForArchive(data) {
    this.quoteForArchive = data;
  }
  public getQuoteForArchive() {
    return this.quoteForArchive;
  }
  public getOnInvoice() {
    return this.onInvoice;
  }
  public setInvoice(data) {
    this.onInvoice.emit(data);
  }
  public resetQuoteForCopy() {
    this.quoteForCopy = null;
  }
  public getQuoteForCopy() {
    return this.quoteForCopy;
  }
  public setCopy(data) {
    this.quoteForCopy = data;
    this.onCopy.emit(null);
  }
  public getOnCopy() {
    return this.onCopy;
  }
  public getOnEdit() {
    return this.onEdit;
  }
  public setEdit(data) {
    this.onEdit.emit(data);
  }
  public onInitAdd() {
    this.onCreate.emit(null);
  }
  public getOnCreate() {
    return this.onCreate;
  }
  public setPreview(data) {
    this.onPreview.emit(data);
  }
  public getOnPreview() {
    return this.onPreview;
  }



  /* public setDescription(description) {
     this.quoteForCreate.description = description;
   }*/



  /*public getServices() {
    return this.servicesList;
  }
*/

  /**
  * set company
  *  @param company company
  */
  /* public setCompany(company) {
     this.client = company;
     this.quoteForCreate.company = company;
   }*/

  /**
  * return client
  */
  /* public getClient() {
     return this.client;
   }*/

  /**
  * return price quote
  * @param cost cost
  * @param count cost
  * @param tax tax 
  */
  public getPrice(cost, count, tax) {
    let price = 0;
    if (tax && tax.rate) {
      price = ((count * cost) * (tax.rate) / 100 + (cost * count));
    } else {
      price = cost * count
    }
    return price;
  }


  /**
   * move to  component with params
   * @param state state
   * @param params params
   */
  public goToState(state, params?) {
    this.state.go(state, params);
  }

  /**
  * Initializes subscribe to save mod
  */
  public saveSandMode(data) {
    this.handleSendMode.emit(data);
  }

  public getHandleSendMode() {
    return this.handleSendMode;
  }
  public saveSandModeList(data) {
    this.handleSendModeList.emit(data);
  }

  public getHandleSendModeList() {
    return this.handleSendModeList;
  }

  public saveSandModePreview(data) {
    this.handleSendModePreview.emit(data);
  }

  public getHandleSendModePreview() {
    return this.handleSendModePreview;
  }

  public saveSandModeEdit(data) {
    this.handleSendModeEdit.emit(data);
  }
  public getHandleSendModeEdit() {
    return this.handleSendModeEdit;
  }

  /**
  * set emails recipients
  * @param value emails
  */
  public setUsersEmail(value) {
    this.usersEmail = value;
  }

  /**
   * Round val
   * @param num val
   */
  public roundToTwo(num) {
    return parseFloat((Math.round(Number(num + 'e+2')) + "e-2")).toFixed(2);
  }

  public onInitFilter(data) {
    this.filter.emit(data);
  }
  public getOnInitFilter() {
    return this.filter;
  }


}
