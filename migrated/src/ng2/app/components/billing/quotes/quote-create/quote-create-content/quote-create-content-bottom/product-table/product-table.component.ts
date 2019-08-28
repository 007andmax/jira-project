import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuoteStateService } from "../../../quote-state.service";
import { ProductService } from "../../../../../../../services/product/product.service";
import { QuoteService } from "../../../../../../../services/quote/quote.service";
import { CommonService } from 'src/ng2/app/services/common/common.service';

/**
 * Product table component
 */
@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  providers:[CommonService]
})
export class ProductTableComponent implements OnInit {

  @Input() set itemsArray(value) {
    this.itemsListArray = value;
    this.quoteStateService.setItemArray(this.itemsListArray);
    this.setDropDownArray();
  };
  @Output() changedProductItemsArray = new EventEmitter<any>();
  public itemsListArray = [];
  public productList = [];
  public servicesList = [];
  public isDropDownShow = [];
  public markups = [];
  unamePattern = "(?<=^| )\d+(\.\d+)?(?=$| )"; 

  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   * @param {QuoteStateService} quoteStateService Service to work quote state
   * @param {QuoteService} quoteService Service to work with api
   * @param {ProductService} productService Service
   */
  constructor(
    private quoteStateService: QuoteStateService,
    private productService: ProductService,
    private quoteService: QuoteService,
    private commonService:CommonService
  ) { }

  /**
   * Initializes product table. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getItemListProducts();
    this.setDropDownArray();
  }

  /**
   * Hide dropdown for services and products
   * @param i - item index
   */
  hideDropDown(i) {
    this.isDropDownShow[i] = false ;
  }

  /**
   * set array for dropdown
   */
  setDropDownArray() {
    this.isDropDownShow = new Array(this.itemsListArray.length);
    this.isDropDownShow.map((item) => item = false );
    this.markups = new Array(this.itemsListArray.length);
    this.markups.map((item) => item = 0 );
  }

  /**
   * get item price
   * @param cost - item cost
   * @param count - item count
   * @param tax - item tax
   */
  public getPrice(cost, count, tax) {
    return this.quoteStateService.roundToTwo(this.quoteStateService.getPrice(cost, count, tax) + this.quoteStateService.getTaxPrice(cost, count, tax)) ;
  }

  /**
   * get item tax price
   * @param cost - item cost
   * @param count - item count
   * @param tax - item tax
   */
  public getTaxPrice(cost, count, tax) {
    return this.quoteStateService.roundToTwo(this.quoteStateService.getTaxPrice(cost, count, tax));
  }

  /**
   * delete item from array
   * @param index - item index
   */
  public deleteItem(index) {
    this.itemsListArray.splice(index, 1);
    this.updateItemsArray();
  }

  /**
   * change item quantity
   * @param value - item value
   * @param index - item index
   */
  public changedQuantity(value, index) {
    this.itemsListArray[index].quantity = value;
    this.updateItemsArray();
  }

  /**
   * toggle dropdown show status
   * @param index - item index
   */
  public toggleShowDropDown(i) {
    this.isDropDownShow[i] = !this.isDropDownShow[i];
  }

  /**
   * get products list item
   */
  public getItemListProducts() {
    this.productService.getCategories().subscribe((res: any) => {
      return this.productList = res
    });
    const value = this.quoteStateService.getClient();
    value && this.quoteService.getServiceList(value.id).subscribe((res: any) => {
      return this.servicesList = res
    });
  }

  /**
   * set new item
   * @param item - new item
   * @param index - new item index
   * @param type - new item type
   */
  public setItem(item, index, type) {
    if (type === 'service') {
      item = {...item, ...{description: '', quantity: 1}};
    } else {
      item = {...item, ...{quantity: 1, markup: this.quoteStateService.setMarkups(item)}};
    }
    this.itemsListArray[index] = item;
    this.changedProductItemsArray.next(this.itemsListArray);
    this.hideDropDown(index);
  }

  /**
   * check item has markup
   * @param index - item index
   */
  public getMarkup(item) {
    return item.hasOwnProperty('markup');
  }

  /**
   * change item markup
   * @param value - item value
   * @param index - item index
   */
  public changeMarkup(value, index) {
    const item = this.itemsListArray[index];
    this.itemsListArray[index].sale =  this.quoteStateService.roundToTwo((value * item.cost / 100 + item.cost));
    this.itemsListArray[index].markup = value;
    this.itemsListArray[index].markup = this.roundingMarkup(this.itemsListArray[index].markup);
    this.updateItemsArray();
  }

  /**
   * change item sales
   * @param value - item value
   * @param index - item index
   */
  public changeSales(value, index) {
    const item = this.itemsListArray[index];
    if (this.getMarkup(this.itemsListArray[index])) {
      this.itemsListArray[index].markup = (value - item.cost) / item.cost * 100;
      this.itemsListArray[index].markup = this.roundingMarkup(this.itemsListArray[index].markup);
      this.itemsListArray[index].sale = this.commonService.validateNumber(value);;
      this.updateItemsArray();
    } else {
      this.itemsListArray[index].rate = this.commonService.validateNumber(value);;
    }
  }

  /**
   * change item cost
   * @param value - item value
   * @param index - item index
   */
  public changeCost(value, index) {
    const item = this.itemsListArray[index];
    if (this.getMarkup(this.itemsListArray[index])) {
      this.itemsListArray[index].markup =  this.quoteStateService.roundToOne((item.sale - value)/value * 100);
      this.itemsListArray[index].cost = this.commonService.validateNumber(value);
    } else {
      this.itemsListArray[index].rate = (this.isInteger(Number(value))) ? value :  this.quoteStateService.roundToTwo(value);
    }
    this.updateItemsArray();
  }


  /**
   * update items array
   */
  public updateItemsArray() {
    this.changedProductItemsArray.next(this.itemsListArray);
    this.quoteStateService.setItemArray(this.itemsListArray);
  }

  /**
   * Check val is integer
   */
  private  isInteger(num):boolean {
    return (num ^ 0) === num;
  }

  /**
   * Roundin value
   */
  private roundingMarkup (markup) {
    return (!this.isInteger(markup)) ?  Math.ceil(markup * 10) / 10 : markup;
  }

}
