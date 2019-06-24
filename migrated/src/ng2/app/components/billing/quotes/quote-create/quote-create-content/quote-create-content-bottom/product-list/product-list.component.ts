import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  /**
   * Creates an instance of the ProductListComponent with the injected services
   */
  constructor() { }

  /**
   * Initializes product list. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.itemList.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.itemList.forEach(item => item.products.sort((a,b) => (a.description.toLowerCase() > b.description.toLowerCase()) ?
      1 : ((b.description.toLowerCase() > a.description.toLowerCase()) ? -1 : 0)) );
  
  }

  /**
   * set and emit product item
   */
  setProduct(productItem) {
    this.selectedProductItem.next(productItem);
  }

}
