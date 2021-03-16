import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryProduct } from 'src/ng2/app/interfaces/product/category-product';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { InventoryStateService } from 'src/ng2/app/states/inventory/inventory-state.service';

@Component({
  selector: 'inventory-add-category',
  templateUrl: './inventory-add-category.component.html',
  styleUrls: ['./inventory-add-category.component.css']
})
export class InventoryAddCategoryComponent implements OnInit {
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  name: string = "";

  categories: Array<CategoryProduct> = [];
  disableCreateCategory: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private productService: ProductService,
    private inventoryStateService: InventoryStateService,) { }

  ngOnInit() {
    if (this.inventoryStateService.getCategories().length > 0) this.categories = this.inventoryStateService.getCategories();
    let getOnCategries = this.inventoryStateService.getOnCategries().subscribe((data) => {
      this.categories = data;

    })
    this.sub.add(getOnCategries);
  }
  checkDublicateCategory() {
    var duplicateCategory = this.categories.filter((item) => {
      return item.name.toLowerCase() === this.name.toLowerCase();
    });
    if (duplicateCategory && duplicateCategory[0]) {
      return this.disableCreateCategory = true;
    } else {
      return this.disableCreateCategory = false;
    }
  };
  public save() {
    if (this.name.length === 0) return;
    this.productService.addCategory(this.name).subscribe(data => {
      this.close();
    })

  }
  public close() {
    this.onClose.emit(null);
  }
}
