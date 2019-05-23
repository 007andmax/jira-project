import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuoteStateService } from "../../../quote-state.service";
import { ProductService } from "../../../../../../../services/product/product.service";
import { QuoteService } from "../../../../../../../services/quote/quote.service";

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
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

  constructor(
    private quoteStateService: QuoteStateService,
    private productService: ProductService,
    private quoteService: QuoteService
  ) { }

  ngOnInit() {
    this.getItemListProducts();
    this.setDropDownArray();
  }

  hideDropDown(i) {
    this.isDropDownShow[i] = false ;
  }

  setDropDownArray() {
    this.isDropDownShow = new Array(this.itemsListArray.length);
    this.isDropDownShow.map((item) => item = false );
    this.markups = new Array(this.itemsListArray.length);
    this.markups.map((item) => item = 0 );
  }

  public getPrice(cost, count, tax) {
    return this.roundToTwo(this.quoteStateService.getPrice(cost, count, tax));
  }

  public getTaxPrice(cost, count, tax) {
    return this.roundToTwo(this.quoteStateService.getTaxPrice(cost, count, tax));
  }

  public deleteItem(index) {
    this.itemsListArray.splice(index, 1);
    this.updateItemsArray();
  }

  public changedQuantity(value, index) {
    this.itemsListArray[index].quantity = value;
    this.updateItemsArray();
  }

  public toggleShowDropDown(i) {
    this.isDropDownShow[i] = !this.isDropDownShow[i];
  }

  public getItemListProducts() {
    this.productService.getCategories().subscribe((res: any) => {
      return this.productList = res
    });
    const value = this.quoteStateService.getClient();
    value && this.quoteService.getServiceList(value.id).subscribe((res: any) => {
      return this.servicesList = res
    });
  }

  public setItem(item, index, type) {
    if (type === 'service') {
      item = {...item, ...{description: '', quantity: 1}};
    } else {
      item = {...item, ...{quantity: 1, markup: this.setMarkups(item)}};
    }
    this.itemsListArray[index] = item;
    this.changedProductItemsArray.next(this.itemsListArray);
    this.hideDropDown(index);
  }

  public getMarkup(item) {
    return item.hasOwnProperty('markup');
  }

  public changeMarkup(value, index) {
    const item = this.itemsListArray[index];
    this.itemsListArray[index].sale =  this.roundToTwo((value * item.cost / 100 + item.cost));
    this.itemsListArray[index].markup = value;
    this.updateItemsArray();
  }

  public changeSales(value, index) {
    const item = this.itemsListArray[index];
    this.itemsListArray[index].markup =  this.roundToTwo((value - item.cost)/item.cost * 100);
    this.itemsListArray[index].sales = value;
    this.updateItemsArray();
  }

  public changeCost(value, index) {
    const item = this.itemsListArray[index];
    if (this.getMarkup(this.itemsListArray[index])) {
      this.itemsListArray[index].markup =  this.roundToTwo((item.sale - value)/value * 100);
      this.itemsListArray[index].cost = value;
    } else {
      this.itemsListArray[index].rate = value;
    }
    this.updateItemsArray();
  }

  public setMarkups(item) {
    if (item.sale > 0 && item.cost > 0 )
      return this.roundToTwo((item.sale - item.cost)/item.cost* 100);
  }

  public updateItemsArray() {
    this.changedProductItemsArray.next(this.itemsListArray);
    this.quoteStateService.setItemArray(this.itemsListArray);
  }

  public roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
  }

}
