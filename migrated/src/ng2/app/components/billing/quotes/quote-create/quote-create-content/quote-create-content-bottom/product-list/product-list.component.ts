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

  constructor() { }

  ngOnInit() {
   
    this.itemList.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.itemList.forEach(item => item.products.sort((a,b) => (a.description.toLowerCase() > b.description.toLowerCase()) ?
      1 : ((b.description.toLowerCase() > a.description.toLowerCase()) ? -1 : 0)) );
  
  }
  setProduct(productItem) {
    this.selectedProductItem.next(productItem);
  }

}
