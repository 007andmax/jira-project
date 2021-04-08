import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryProduct } from 'src/ng2/app/interfaces/product/category-product';
import { InventoryStateService } from 'src/ng2/app/states/inventory/inventory-state.service';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { TitleListType } from '../../../tickets/tickets/tickets-header/class/title-list-type';

@Component({
  selector: 'inventory-filter',
  templateUrl: './inventory-filter.component.html',
  styleUrls: ['./inventory-filter.component.css']
})
export class InventoryFilterComponent implements OnInit {
  showAddCategory: boolean = false;
  categories: Array<CategoryProduct> = [];
  sub: Subscription = new Subscription();
  listActive: Array<TitleListType> = [new TitleListType('Active products', 'ACTIVE'), new TitleListType('Inactive products', 'NO_ACTIVE')];
  selectedActive = new TitleListType('Active products', 'ACTIVE');
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
  selectActive(data) {
    this.selectedActive = data;
    this.inventoryStateService.setSortActive(data.type === 'ACTIVE');
  }
  onSelectCategory(category) {
    //  this.sortCategoty = category;
    this.inventoryStateService.setSortCategory(category);
  }
}
