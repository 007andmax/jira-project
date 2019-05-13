import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuoteStateService } from "../../../quote-state.service";

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent implements OnInit {

  @Input() set itemsArray(value) {
    console.log(value);
    this.itemsListArray = value;
    this.quoteStateService.setItemArray(this.itemsListArray);
  };
  @Output() changedProductItemsArray = new EventEmitter<any>();
  // @Input() itemsListArray: any;
  public showProductsCategory = false;
  public itemsListArray = [];

  constructor(
    private quoteStateService: QuoteStateService
  ) { }

  ngOnInit() {
  }

  toggleShowCategory() {
    this.showProductsCategory = !this.showProductsCategory;
  }

  public setProductItem(productItem) {
    this.toggleShowCategory();
  }

  public getPrice(cost, count) {
    return this.quoteStateService.getPrice(cost, count);
  }

}
