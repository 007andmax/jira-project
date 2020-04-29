import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { Product } from 'src/ng2/app/interfaces/product/product';

@Component({
  selector: 'app-ticket-profile-form-update-products',
  templateUrl: './ticket-profile-form-update-products.component.html',
  styleUrls: ['./ticket-profile-form-update-products.component.scss']
})
export class TicketProfileFormUpdateProductsComponent implements OnInit {
  addedProductList = [];
  public productList = [];
  currentProduct: Product;
  constructor(private productService: ProductService, ) { }

  ngOnInit() {
    this.currentProduct = this.getDefaultProfuct();
    this.getItemListProducts();
  }
  public getItemListProducts() {
    this.productService.getCategories().subscribe((res: any) => {
      this.productList = res;

    });
  }
  public selectProduct(item) {
    console.log("item", item);
    this.currentProduct = item;
  }
  public trackByIndex(index, item) {
    return index;
  }
  private getDefaultProfuct() {
    return {
      cost: 0,
      description: "",
      glNumber: null,
      ilc: "",
      manufacture: "",
      sale: 0,
      taxes: [],
      versionedId: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      company: null,
      category: null,
      billable: null,
      oldVersion: null,
    }
  }
}
