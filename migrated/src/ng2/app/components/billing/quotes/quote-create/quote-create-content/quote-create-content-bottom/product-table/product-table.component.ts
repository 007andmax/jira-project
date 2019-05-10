import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTableComponent implements OnInit {

  @Input() productItemsArray: any;
  public showProductsCategory = false;

  constructor() { }

  ngOnInit() {
  }

  toggleShowCategory() {
    this.showProductsCategory = !this.showProductsCategory;
  }

  public setProductItem(productItem) {
    this.toggleShowCategory();
    this.productItemsArray = [...this.productItemsArray, ...productItem];
  }

}
