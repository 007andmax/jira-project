import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from "../../../../../../../services/product/product.service";

/**
 * Product list component
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  @Output() selectedProductItem = new EventEmitter<any>();
  @Input() itemList: any;

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.itemList.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    console.log(this.itemList, '1235123');
  }

  setProduct(productItem) {
    this.selectedProductItem.next(productItem);
  }

}
