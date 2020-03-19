import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { CategoryProduct } from 'src/ng2/app/interfaces/product/category-product';

@Component({
  selector: 'app-left-panel-inventory',
  templateUrl: './left-panel-inventory.component.html',
  styleUrls: ['./left-panel-inventory.component.scss']
})
export class LeftPanelInventoryComponent implements OnInit {
  inventoryCategoryList: Array<CategoryProduct> = [];
  currentCategory: CategoryProduct = null;
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getCategoriesProducts().subscribe(data => {
      this.inventoryCategoryList = data;
    })
  }
  getAllProductsCount() {
    let count = 0;
    this.inventoryCategoryList.map((item) => {
      count += item.productsAmount;
    });
    return count;
  };
  public trackById(index, item) {
    return item.id;
  }

}
