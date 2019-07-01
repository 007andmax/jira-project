import { EventEmitter, Inject, Injectable } from '@angular/core';
import { DateService } from "../../../../services/date/date.service";
import { QuoteService } from "../../../../services/quote/quote.service";
import { FormGroup } from '@angular/forms';

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
  public quoteForm: FormGroup;

  constructor(
    @Inject('$state') $state: any,
    private dateService: DateService
  ) {
    this.state = $state;
  }
  public setQuoteForm (quoteForm) {
    this.quoteForm = quoteForm;
  }

  public getQuoteForm () {return this.quoteForm;}

  public setError (error) {
    this.handleErrors.emit(error);
  }
  public getErrorHandle () { return this.handleErrors;}
  public setClient(client) {
    this.client = client;
    this.quoteForCreate.client = client;
  }
  public setCompany(company) {
    this.client = company;
    this.quoteForCreate.company = company;
  }
  public getClient() {
    return this.client;
  }

  public getPrice(cost, count, tax) {
    let price = 0;
    if (tax && tax.rate) {
      price = ((count * cost) * (tax.rate) / 100 + (cost * count));
    } else {
      price = cost * count
    }
    return price;
  }

  public getTaxPrice(cost, count, tax) {
    let sum = 0;
    if (tax && tax.length > 0) {
      tax.map((item) => {
        sum += ((item.rate) / 100) * cost * count
      })
    }
    return sum;

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

  public setStartQuoteNumber(value) {
    this.startQuoteNumber = value;
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
  public resetQuote() {
    this.resetquoteForCreate();
    this.itemsArray = [];
    this.subTotalProducts = 0;
    this.subTotalServices = 0;
    this.totalTaxes = 0;
    this.total = 0;
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
    this.startQuoteNumber = quote.number;
    this.quoteNumber = quote.number;
    this.setClient(quote.company);
    this.setDataClientForPreview(quote.primaryContact, quote.client);
    if (quote.products) quote.products.forEach(element => element.markup = this.setMarkups(element));
    const itemsArray = [...quote.products, ...quote.services];
    this.setItemArray(itemsArray);
    this.setType(true);
    console.log(quote, 'QUOTE');
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

  public getStartQuotenumber() {
    return this.startQuoteNumber;
  }

  goToPreview(quote, editable?) {
    this.quoteForCreate = quote;
    this.setClient(quote.company);
    this.setDataClientForPreview(quote.primaryContact, quote.client);
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

  public setDataClientForPreview(approvedBy, client) {
    client.companyInfo = {
      contacts : [{
        firstName: approvedBy.firstName,
        lastName: approvedBy.lastName,
        primaryEmail: approvedBy.primaryEmail
      }],
      addresses: client.addresses
    };
  }

  public divideArray() {
    this.itemsArray = this.getItemArray();
    this.productsArray = this.getProductItems(this.itemsArray, 'product');
    this.servicesArray = this.getProductItems(this.itemsArray, 'service');
  }

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

  public getTotal() {
    return this.totalTaxes + this.subTotalServices + this.subTotalProducts
  }

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

  public setSubject(value) {
    this.quoteForCreate.subject = value;
  }

  public setMessage(value) {
    console.log('test', value);
    this.quoteForCreate.message = value;
  }

  public saveSandMode() {
    this.handleSendMode.emit();
  }

  public setUsersEmail(value) {
    this.usersEmail = value;
  }

  public getUsersEmail() {
    return this.usersEmail;
  }
  public setMarkups(item) {
    if (item.sale > 0 && item.cost > 0)
      return this.roundToTwo((item.sale - item.cost) / item.cost * 100);
  }
  public roundToTwo(num) {
    return parseFloat((Math.round(Number(num + 'e+2')) + "e-2")).toFixed(2);
  }
  public resetquoteForCreate() {
    this.quoteForCreate = this.getDefaultquoteForCreate();
  }
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
      globalNote: '',
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
