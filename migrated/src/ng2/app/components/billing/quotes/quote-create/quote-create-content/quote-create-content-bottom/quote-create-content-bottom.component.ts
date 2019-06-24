import { Component, Input, OnInit } from '@angular/core';
import {QuoteStateService} from "../../quote-state.service";
import {QuoteService} from "../../../../../../services/quote/quote.service";

/**
 *  Quotes create content bottom component
 */
@Component({
  selector: 'app-quote-create-content-bottom',
  templateUrl: './quote-create-content-bottom.component.html',
  styleUrls: ['./quote-create-content-bottom.component.scss']
})
export class QuoteCreateContentBottomComponent implements OnInit {

  @Input() set clientId(value: any) {
    this.client = value;
    this.quoteStateServices.setClient(value);
    this.type = undefined;
    this.itemsArray = [];
  }
  public serviceList: any;
  public client: any;
  public type: string;
  public itemsArray = [];
  public productsArray = [];
  public servicesArray = [];
  public subTotalServices = 0;
  public subTotalProducts = 0;
  public totalTaxes = 0;
  public total = 0;
  public editMode: any;
  public quote: any;


  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   * @param {QuoteStateService} quoteStateServices Service to work quote state
   * @param {QuoteService} quoteServices Service to work with api
   */
  constructor(
    private quoteStateServices: QuoteStateService,
    private quoteServices: QuoteService,

  ) { }

  /**
   * Initializes quotes create bottom content. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.initEditItemsArray();
    this.getState();
  }

  /**
   * add product
   */
  public addProduct() {
    this.type = 'product';
  }

  /**
   * add service
   */
  public addService() {
    this.type = 'service';
  }

  /**
   * add item to array
   */
  public addItemToItemsArray(item) {
    this.itemsArray.push(item);
    this.calculateArrays();
  }

  /**
   * divide arrays by type
   */
  public divideArray() {
    this.itemsArray = this.quoteStateServices.getItemArray();
    this.productsArray = this.quoteServices.getProductItems(this.itemsArray, 'product');
    this.servicesArray = this.quoteServices.getProductItems(this.itemsArray, 'service');
  }

  /**
   * calculate arrays data and total sums
   */
  public calculateArrays() {
    this.refreshTotals();
    this.divideArray();
    this.resolveTotal();
    this.resolveTaxes();
  }

  /**
   * refresh all total sums
   */
  public refreshTotals() {
    this.subTotalServices = 0;
    this.subTotalProducts = 0;
    this.totalTaxes = 0;
    this.total = 0;
  }

  /**
   * resolve total
   */
  public resolveTotal() {
    this.divideArray();
    this.productsArray.map((item) => {
      const product = item.item;
      this.subTotalProducts += product.sale * product.quantity;
    });
    this.servicesArray.map((item) => {
      const service = item.item;
      this.subTotalServices += service.rate * service.quantity;

    });
    this.quoteStateServices.setSubTotalProducts(this.subTotalProducts);
    this.quoteStateServices.setSubTotalServices(this.subTotalServices);
    this.resolveTaxes();
    this.total = this.getTotal();
    this.quoteStateServices.setTotal(this.total);
  }

  /**
   * resolve total taxes
   */
  public resolveTaxes() {
    this.totalTaxes = 0;
    if (this.itemsArray.length > 0) {
      this.itemsArray.map((item) => {
        const taxes = item.taxes;
        const product = item;
        if (taxes && taxes.length > 0) {
          taxes.map((item) => {
            this.totalTaxes += (((item.rate)/100) * (product.sale || product.rate)) * product.quantity;
          })
        }
        this.quoteStateServices.setTotalTaxes(this.totalTaxes);
      });
    } else {
      this.totalTaxes = 0;
      this.quoteStateServices.setTotalTaxes(this.totalTaxes);
    }

  }

  /**
   * get total sum
   */
  public getTotal() {
    return this.totalTaxes + this.subTotalServices + this.subTotalProducts
  }

  /**
   * change type
   */
  public changeType(type) {
    this.type = type;
  }

  /**
   * refresh and calculate items array
   */
  public refreshItemsArray(value) {
    this.itemsArray = value;
    this.calculateArrays();
  }

  /**
   * set edit items array
   */
  public initEditItemsArray() {
    this.itemsArray = this.quoteStateServices.getItemArray();
  }

  /**
  * get mode state
  */
  public getState() {
    this.editMode = this.quoteStateServices.getState().params.editMode;
    if (this.editMode) {
      this.quote = this.quoteStateServices.getQuoteCreate();
      this.resolveTaxes();
      this.resolveTotal();
      this.quote.subTotalServices && (this.subTotalServices = this.quote.subTotalServices);
      this.quote.subTotalProducts && (this.subTotalProducts = this.quote.subTotalProducts);
      this.quote.totalTaxes && (this.totalTaxes = this.quote.totalTaxes);
      this.quote.total && (this.total = this.quote.total);
    }
  }

}
