import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { CategoryProduct } from 'src/ng2/app/interfaces/product/category-product';

@Component({
  selector: 'app-add-category-product',
  templateUrl: './add-category-product.component.html',
  styleUrls: ['./add-category-product.component.scss']
})
export class AddCategoryProductComponent implements OnInit {
  @Input() inventoryCategoryList: Array<CategoryProduct> = [];
  disableCreateCategory: boolean = false;
  name: string = '';
  constructor(private productService: ProductService) { }

  ngOnInit() {
  }
  clearCategory() {
    this.name = '';
  }
  checkDublicateCategory() {
    var duplicateCategory = this.inventoryCategoryList.filter((item) => {
      return item.name.toLowerCase() === this.name.toLowerCase();
    });
    if (duplicateCategory && duplicateCategory[0]) {
      return this.disableCreateCategory = true;
    } else {
      return this.disableCreateCategory = false;
    }
  };
  addCategory() {
    this.productService.addCategory(this.name).subscribe(data => {

    })
  }
}
