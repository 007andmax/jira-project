import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryProduct } from 'src/app/interfaces/product/category-product';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { TitleListType } from '../../../tickets/tickets/tickets-header/class/title-list-type';
import { ProductType } from 'src/app/components/setting/products-settings/class/product-type';
@Component({
  selector: 'inventory-filter',
  templateUrl: './inventory-filter.component.html',
  styleUrls: ['./inventory-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryFilterComponent implements OnInit {
  showAddCategory: boolean = false;
  categories: Array<CategoryProduct> = [];
  sub: Subscription = new Subscription();
  listActive: Array<TitleListType> = [new TitleListType('Active products', 'ACTIVE'), new TitleListType('Inactive products', 'NO_ACTIVE')];
  selectedActive = new TitleListType('Active products', 'ACTIVE');
  listTypes: Array<ProductType> = [];
  @ViewChild('categoriesSelect') categoriesSelect: DropDownComponent;
  @Output() onResetSelected: EventEmitter<any> = new EventEmitter();
  constructor(private inventoryStateService: InventoryStateService,
    public cd: ChangeDetectorRef,) { }
  ngOnInit() {
    if (this.inventoryStateService.getListTypes().length > 0) {
      this.listTypes = JSON.parse(JSON.stringify(this.inventoryStateService.getListTypes())).map(item => new ProductType(item)).sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
    }
    let onGetServiceType = this.inventoryStateService.onGetListType.subscribe(data => {
      this.listTypes = data.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));;
    })
    this.sub.add(onGetServiceType);
    if (this.inventoryStateService.getSortCategoty()) this.categoriesSelect.selectItemWithOutChanges(this.inventoryStateService.getSortCategoty());
    if (this.inventoryStateService.getCategories().length > 0) this.categories = this.inventoryStateService.getCategories();
    this.cd.markForCheck();
    let getOnCategries = this.inventoryStateService.getOnCategries().subscribe((data) => {
      this.categories = data;
      if (this.categoriesSelect) this.categoriesSelect.reset(this.categories);
      this.cd.detectChanges();
    })
    this.sub.add(getOnCategries);
    let getOnSortCategory = this.inventoryStateService.getOnSortCategory().subscribe(data => {
      this.categoriesSelect.selectItemWithOutChanges(data);
      this.cd.detectChanges();
    })
    this.sub.add(getOnSortCategory);
  }
  onSelectProuctType(data) {
    this.inventoryStateService.setSortType(data);
    this.onResetSelected.emit(null);
  }
  selectActive(data) {
    this.selectedActive = data;
    this.inventoryStateService.setSortActive(data.type === 'ACTIVE');
    this.onResetSelected.emit(null);
    this.cd.detectChanges();
  }
  onSelectCategory(category) {
    //  this.sortCategoty = category;
    this.inventoryStateService.setSortCategory(category);
    this.onResetSelected.emit(null);
    this.cd.detectChanges();
  }
}
