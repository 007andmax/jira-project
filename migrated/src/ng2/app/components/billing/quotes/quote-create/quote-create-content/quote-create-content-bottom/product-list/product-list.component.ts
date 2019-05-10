import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { ProductService } from "../../../../../../../services/product/product.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  public categories$: any;
  @Output() selectedProductItem = new EventEmitter<any>();

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.getCategoriesAndProducts();
  }

  getCategoriesAndProducts() {
    this.categories$ = this.productService.getCategories()
  }

  setProduct(productItem) {
    this.selectedProductItem.next(productItem);
  }

}
