import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuoteStateService } from "../../../quote-state.service";

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent implements OnInit {

  @Input() set itemsArray(value) {
    this.itemsListArray = value;
    this.quoteStateService.setItemArray(this.itemsListArray);
  };
  @Output() changedProductItemsArray = new EventEmitter<any>();
  public showProductsCategory = false;
  public itemsListArray = [];
  public isDropDownShow = false;

  constructor(
    private quoteStateService: QuoteStateService
  ) { }

  ngOnInit() {}

  toggleShowCategory() {
    this.showProductsCategory = !this.showProductsCategory;
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

  public toggleShowDropDown() {
    this.isDropDownShow = !this.isDropDownShow;
  }

}
