import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from "../../../../../../../services/product/product.service";

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

  ngOnInit() {}

  setProduct(productItem) {
    this.selectedProductItem.next(productItem);
  }

}
