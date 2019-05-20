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
    console.log(this.isDropDownShow, '135123');
  }

  public getPrice(cost, count, tax) {
    return Math.floor(this.quoteStateService.getPrice(cost, count, tax));
  }

  public getTaxPrice(cost, count, tax) {
    return Math.floor(this.quoteStateService.getTaxPrice(cost, count, tax));
  }

  public deleteItem(index) {
    this.itemsListArray.splice(index, 1);
    this.quoteStateService.setItemArray(this.itemsListArray);
  }

  public changedQuantity(value, index) {
    this.itemsListArray[index].quantity = value;
    this.changedProductItemsArray.next(this.itemsListArray);
    this.quoteStateService.setItemArray(this.itemsListArray);
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
    console.log(this.productList,'productList');
  }

  public setItem(item, index, type) {
    if (type === 'service') {
      item = {...item, ...{description: '', quantity: 1}};
    } else {
      item = {...item, ...{quantity: 1, markup: ''}};
    }
    this.itemsListArray[index] = item;
    this.changedProductItemsArray.next(this.itemsListArray);
    this.hideDropDown(index);
  }

  public getMarkup(item) {
    return item.hasOwnProperty('markup');
  }

}
