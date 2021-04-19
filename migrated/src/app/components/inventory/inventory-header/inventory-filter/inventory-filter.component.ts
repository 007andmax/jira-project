import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryProduct } from 'src/app/interfaces/product/category-product';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';

@Component({
  selector: 'inventory-filter',
  templateUrl: './inventory-filter.component.html',
  styleUrls: ['./inventory-filter.component.css']
})
export class InventoryFilterComponent implements OnInit {
  showAddCategory: boolean = false;
  categories: Array<CategoryProduct> = [];
  sub: Subscription = new Subscription();
  @ViewChild('categoriesSelect') categoriesSelect: DropDownComponent;
  constructor(private inventoryStateService: InventoryStateService,) { }

  ngOnInit() {
    if (this.inventoryStateService.getCategories().length > 0) this.categories = this.inventoryStateService.getCategories();
    let getOnCategries = this.inventoryStateService.getOnCategries().subscribe((data) => {
      this.categories = data;
      this.categoriesSelect.reset(this.categories);
    })
    this.sub.add(getOnCategries);
  }
  onSelectCategory(category) {
    //  this.sortCategoty = category;
    this.inventoryStateService.setSortCategory(category);
  }
}
