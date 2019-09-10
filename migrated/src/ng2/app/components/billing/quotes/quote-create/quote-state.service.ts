import { EventEmitter, Inject, Injectable } from '@angular/core';
import { DateService } from "../../../../services/date/date.service";
import { QuoteService } from "../../../../services/quote/quote.service";
import { FormGroup } from '@angular/forms';
import { ISubscription } from 'rxjs/Subscription';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { QuoteResult } from '../class/quote-result';

@Injectable({
  providedIn: 'root'
})
export class QuoteStateService {

  public client: any;
  public itemsArray: any;
  public type = false;
  public validateForm: EventEmitter<any> = new EventEmitter();
  public handleSendMode: EventEmitter<any> = new EventEmitter();
  public handleErrors: EventEmitter<any> = new EventEmitter();
  public handleQuoteHasSent: EventEmitter<any> = new EventEmitter();
 // public quoteHasSent: boolean = false;
  public quoteNumber: number;
  public startQuoteNumber: number;
  public state;
  public subTotalProducts = 0;
  public subTotalServices = 0;
  public totalTaxes = 0;
  public total = 0;
  public productsArray: any;
  public servicesArray: any;
  public selectedNoteFull: any;
  public usersEmail: any;
  public quoteForCreate: any = this.getDefaultquoteForCreate();
  public subGetCompaniesList: ISubscription;
  public quoteForm: FormGroup;
  public clientsList:any;
  private quoteResult: QuoteResult;
  
  constructor(
    @Inject('$state') $state: any,
    private dateService: DateService,
    private companiesService: CompaniesService,
  ) {
    this.state = $state;
    this.onInitCLientsList();
  }

  /**
   * Set result after request for alert
   */
  public setQuoteResult (message) {
    this.quoteResult = new QuoteResult(message);
  }

   /**
   * Get result for alert
   */
  public getQuoteResult () {
    return this.quoteResult;
  }

   /**
   * Get subscribe for check quote has benn sent
   */
  public getHandleQuoteHasSent() {
    return this.handleQuoteHasSent;
  }

   /**
   * Initializes subscribe for check quote has benn sent
   */
  public setHandleQuoteHasSent() {
    this.handleQuoteHasSent.emit(null);
  }

  /**
   * Initializes subscribe on clients 
   */
  private onInitCLientsList() {
    this.subGetCompaniesList = this.companiesService.clientsCompany.subscribe((res: any) => {
      this.clientsList = res
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((item) => !item.deletedAt)
    })
  }

  /**
   * Return client 
   */
  public getClent () {
    let index: number = this.clientsList.findIndex(item => item.id === this.client.id);
    if (index > (-1)) {
     return this.clientsList[index];
    } else {
      return this.client;
    }
  }
  /**
   * set quote form
   * @param quoteForm quote form
   */
  public setQuoteForm (quoteForm) {
    this.quoteForm = quoteForm;
  }

  /**
   * Return quote form
   */
  public getQuoteForm () {return this.quoteForm;}

  /**
   * set error when edit/create
   * @param error error
   */
  public setError (error) {
    this.handleErrors.emit(error);
  }

  /**
   * return error handle
   */
  public getErrorHandle () { return this.handleErrors;}

  /**
   * set client
   *  @param client client
   */
  public setClient(client) {
    this.client = client;
    this.quoteForCreate.client = client;
  }

   /**
   * set company
   *  @param company company
   */
  public setCompany(company) {
    this.client = company;
    this.quoteForCreate.company = company;
  }

   /**
   * return client
   */
  public getClient() {
    return this.client;
  }

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
   * return tax price quote
   * @param cost cost
   * @param count cost
   * @param tax tax 
   */
  public getTaxPrice(cost, count, tax) {
    let sum = 0;
    if (tax && tax.length > 0) {
      tax.map((item) => {
        sum += ((item.rate) / 100) * cost * count
      })
    }
    return sum;

  }

  /**
   * set product / service quote
   * @param itemsArray quote
   */
  public setItemArray(itemsArray) {
    this.itemsArray = itemsArray;
    this.quoteForCreate.itemsArray = itemsArray;
  }

  /**
   * get list product / service quote
   */
  public getItemArray() {
    return this.itemsArray;
  }

   /**
   * set type for add product / service quote
   * @param value type
   */
  public setType(value) {
    this.type = value;
  }

   /**
   * get type for add product / service quote
   */
  public getType() {
    return this.type;
  }

  /**
   * set valid for add product / service quote
   */
  public emitValidation() {
    this.validateForm.emit(this.type)
  }

  /**
   * set number quote
   * @param value number quote
   */
  public setNumber(value) {
    this.quoteNumber = value;
    this.quoteForCreate.quoteNumber = value;
  }

    /**
   * set start number quote
   * @param value number quote
   */
  public setStartQuoteNumber(value) {
    this.startQuoteNumber = value;
  }

  /**
   * get quote number
   */
  public getQuoteNumber() {
    return this.quoteNumber;
  }

  /**
   * move to component for create quote
   */
  public goToCreate() {
    this.state.go('quote-create-component');
  }

  /**
   * move to quote component
   */
  public goToQuote() {
    this.setUsersEmail([]);
    this.state.go('quotes-component');
  }

   /**
   * return state
   */
  public getState() {
    return this.state;
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
   * return quote
   */
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

  /**
   * reset quote
   */
  public resetQuote() {
    this.resetquoteForCreate();
    this.itemsArray = [];
    this.subTotalProducts = 0;
    this.subTotalServices = 0;
    this.totalTaxes = 0;
    this.total = 0;
  }

  /**
   * set sub total products
   * @param value total products
   */
  public setSubTotalProducts(value) {
    this.subTotalProducts = value;
    this.quoteForCreate.subTotalProducts = value;
  }

   /**
   * set total taxes
   * @param value tax
   */
  public setTotalTaxes(value) {
    this.totalTaxes = value;
    this.quoteForCreate.totalTaxes = value;
  }

   /**
   * set total quote
   * @param value total
   */
  public setTotal(value) {
    this.total = value;
    this.quoteForCreate.total = value;
  }

   /**
   * set sub total services
   * @param value total services
   */
  public setSubTotalServices(value) {
    this.subTotalServices = value;
    this.quoteForCreate.subTotalServices = value;
  }

   /**
   * Set start date
   * @param value date
   */
  public setStartDate(value) {
    this.quoteForCreate.startDate = value;
  }

   /**
   * Set end date
   * @param value date
   */
  public setEndDate(value) {
    this.quoteForCreate.endDate = value;
  }

    /**
   * return quote for create
   */
  getQuoteCreate() {
    return this.quoteForCreate;
  }

   /**
   * set global note 
   * @param value note
   */
  public setGlobalNote(value) {
    this.quoteForCreate.globalNote = value;
  }

    /**
   * return global note 
   */
  public getGlobalNote() {
    return this.quoteForCreate.globalNote;
  }

   /**
   * set note
   * @param value note
   */
  public setSelectedNote(value) {
    this.quoteForCreate.selectedNote = value;
  }

   /**
   * Set note
   * @param value note
   */
  public setSelectedNoteFull(value) {
    this.selectedNoteFull = value;
  }

   /**
   * return note
   */
  public getSelectedNote() {
    return this.selectedNoteFull;
  }

   /**
   * Set deposit
   * @param value deposit
   */
  public setPartialDeposit(value) {
    this.quoteForCreate.partialDeposit = value;
  }

    /**
   * Get deposit
   */
  public getPartialDeposit() {
    return this.quoteForCreate.partialDeposit
  }

   /**
   * Set order
   * @param value order
   */
  public setPurchaseOrder(value) {
    this.quoteForCreate.purchaseOrder = value;
  }

  /**
   * Get order
   */
  public getPurchaseOrder() {
    return this.quoteForCreate.purchaseOrder
  }

  /**
   * Set payment
   * @param value payment
   */
  public setRequestPayment(value) {
    this.quoteForCreate.requestPayment = value;
  }

   /**
   * Get payment
   */
  public getRequestPayment() {
    return this.quoteForCreate.requestPayment
  }

   /**
   * set edit quote
   * @param quote quote
   */
  public setEditQuote(quote) {
    this.quoteForCreate = quote;
    this.startQuoteNumber = quote.number;
    this.quoteNumber = quote.number;
    this.setClient(quote.company);
    quote.client = this.getClent();
    console.log(quote, 'QUOTE');
    if (quote.products) quote.products.forEach(element => element.markup = this.setMarkups(element));
    const itemsArray = [...quote.products, ...quote.services];
    this.setItemArray(itemsArray);
    this.setType(true);
    
    this.setNumber(quote.number);
    this.setStartQuoteNumber(quote.number);
    this.setEndDate(this.dateService.getStartDate(quote.validUntil));
    this.setStartDate(this.dateService.getStartDate(quote.date));
    if (quote.reviewNotes) quote.reviewNotes.forEach(element => element.startDate = this.dateService.getStartDate(element.createdAt));
    this.setGlobalNote(quote.globalNote);
    this.setSelectedNote(quote.regularNote);
    this.setPartialDeposit(quote.partialDeposit);
    this.setPurchaseOrder(quote.purchaseOrder);
    this.setRequestPayment(quote.requestPayment);
    this.goToState('quote-create-component', { editMode: true });
    this.setUsersEmail(quote.recipients);
  }

    /**
   * Get start quote number
   */
  public getStartQuotenumber() {
    return this.startQuoteNumber;
  }

  /**
   * move to preview page
   * @param quote quote
   * @param editable edit mode
   */
  goToPreview(quote, editable?) {
    this.quoteForCreate = quote;
    this.setClient(quote.company);
    const itemsArray = [...quote.products, ...quote.services];
    if (quote.reviewNotes) quote.reviewNotes.forEach(element => element.startDate = this.dateService.getStartDate(element.createdAt));
    this.setItemArray(itemsArray);
    this.setNumber(quote.number);
    this.setEndDate(this.dateService.getStartDate(quote.validUntil));
    this.setStartDate(this.dateService.getStartDate(quote.date));
    this.setGlobalNote(quote.globalNote);
    this.setSelectedNote(quote.regularNote);
    this.setPartialDeposit(quote.partialDeposit);
    this.setPurchaseOrder(quote.purchaseOrder);
    this.setRequestPayment(quote.requestPayment);
    this.resolveTaxes();
    this.resolveTotal();
    this.goToState('quote-preview-component', { editMode: true, editable: editable ? editable : true });
  }

   /**
   * Set products / services
   */
  public divideArray() {
    this.itemsArray = this.getItemArray();
    this.productsArray = this.getProductItems(this.itemsArray, 'product');
    this.servicesArray = this.getProductItems(this.itemsArray, 'service');
  }

   /**
   * Reset data quote
   */
  public resolveTotal() {
    this.divideArray();
    this.subTotalServices = 0;
    this.subTotalProducts = 0;
    this.productsArray.map((item) => {
      const product = item.item;
      this.subTotalProducts += product.sale * product.quantity;
    });
    this.servicesArray.map((item) => {
      const service = item.item;
      this.subTotalServices += service.rate * service.quantity;

    });
    this.setSubTotalProducts(this.subTotalProducts);
    this.setSubTotalServices(this.subTotalServices);
    this.resolveTaxes();
    this.total = this.getTotal();
    this.setTotal(this.total);
  }

  /**
   * return total quote
   */
  public getTotal() {
    return this.totalTaxes + this.subTotalServices + this.subTotalProducts
  }

  /**
   * Reset taxes data quote
   */
  public resolveTaxes() {
    this.totalTaxes = 0;
    if (this.itemsArray.length > 0) {
      this.itemsArray.map((item) => {
        const taxes = item && item.taxes;
        const product = item;
        if (taxes && taxes.length > 0) {
          taxes.map((item) => {
            this.totalTaxes += (((item.rate) / 100) * (product.sale || product.rate)) * product.quantity;
          })
        }
        this.setTotalTaxes(this.totalTaxes);
      });
    } else {
      this.totalTaxes = 0;
      this.setTotalTaxes(this.totalTaxes);
    }
  }

  /**
   * Get products / services for request
   * @param itemsAray services and products
   * @param type type
   */
  getProductItems(itemsAray, type) {
    if (type === 'service') {
      itemsAray = itemsAray.filter((item) => item.hasOwnProperty('rate'));
      return itemsAray.map((item, index) => ({
        item: item,
        "itemOrder": index,
        "quantity": 1,
        "discountType": "PERCENT"
      }))
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
   * set subject
   * @param value subject
   */
  public setSubject(value) {
    this.quoteForCreate.subject = value;
  }

   /**
   * set message
   * @param value message
   */
  public setMessage(value) {
    this.quoteForCreate.message = value;
  }

   /**
   * Initializes subscribe to save mod
   */
  public saveSandMode() {
    this.handleSendMode.emit();
  }

   /**
   * set emails recipients
   * @param value emails
   */
  public setUsersEmail(value) {
    this.usersEmail = value;
  }

   /**
   * return emails recipients
   */
  public getUsersEmail() {
    return this.usersEmail;
  }

  /**
   * Set markup
   * @param item markup
   */
  public setMarkups(item) {
    if (item.sale > 0 && item.cost > 0)  return this.roundToOne((item.sale - item.cost) / item.cost * 100);
    return 0;
     
  }

  /**
   * Round val
   * @param num val
   */
  public roundToTwo(num) {
    return parseFloat((Math.round(Number(num + 'e+2')) + "e-2")).toFixed(2);
  }

   /**
   * Round val
   * @param num val
   */
  public roundToOne(num) {
    return parseFloat((Math.round(Number(num + 'e+2')) + "e-2")).toFixed(2);
  }

   /**
   * Reset quote for create
   */
  public resetquoteForCreate() {
    this.quoteForCreate = this.getDefaultquoteForCreate();
  }

   /**
   * return structure quote for create
   */
  private getDefaultquoteForCreate(): any {
    return {
      startDate: '',
      endDate: '',
      quoteNumber: '',
      itemsArray: '',
      client: '',
      subTotalProducts: '',
      subTotalServices: '',
      totalTaxes: '',
      total: '',
      globalNote: null,
      selectedNote: '',
      partialDeposit: '',
      purchaseOrder: '',
      requestPayment: '',
      subject: '',
      message: '',
      recipients: [],
      products: [],
      services: []
    }
  }

}
