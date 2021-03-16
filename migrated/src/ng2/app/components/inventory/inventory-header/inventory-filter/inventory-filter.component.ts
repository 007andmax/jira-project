import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryProduct } from 'src/ng2/app/interfaces/product/category-product';
import { InventoryStateService } from 'src/ng2/app/states/inventory/inventory-state.service';

@Component({
  selector: 'inventory-filter',
  templateUrl: './inventory-filter.component.html',
  styleUrls: ['./inventory-filter.component.css']
})
export class InventoryFilterComponent implements OnInit {
  showAddCategory: boolean = false;
  categories: Array<CategoryProduct> = [];
  sub: Subscription = new Subscription();
  constructor(private inventoryStateService: InventoryStateService,) { }

  ngOnInit() {
    if (this.inventoryStateService.getCategories().length > 0) this.categories = this.inventoryStateService.getCategories();
    let getOnCategries = this.inventoryStateService.getOnCategries().subscribe((data) => {
      this.categories = data;
    })
    this.sub.add(getOnCategries);
  }
  onSelectCategory(category) {
    //  this.sortCategoty = category;
    this.inventoryStateService.setSortCategory(category);
  }
}
