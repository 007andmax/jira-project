import { Component, OnInit } from '@angular/core';
import { ProductType } from '../class/product-type';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-products-settings-type',
  templateUrl: './products-settings-type.component.html',
  styleUrls: ['./products-settings-type.component.scss']
})
export class ProductsSettingsTypeComponent implements OnInit {
  list: Array<ProductType> = [];
  showAdd: boolean = false;
  showPreloader: boolean = true;
  constructor(private productService: ProductService,) { }

  ngOnInit() {
    this.productService.getProductsTypes().subscribe((data: any) => {
      this.list = data.productTypeDtos.map(item => new ProductType(item));
      this.showPreloader = false;
    })
  }
  public toggleShowAdd(data) {
    this.showAdd = data;
  }
}
