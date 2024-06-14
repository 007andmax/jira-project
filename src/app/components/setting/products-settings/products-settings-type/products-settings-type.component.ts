import { Component, OnInit } from '@angular/core';
import { ProductType } from '../class/product-type';
import { ProductService } from 'src/app/services/product/product.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductTypeFilter } from '../class/product-type-filter';

@Component({
  selector: 'app-products-settings-type',
  templateUrl: './products-settings-type.component.html',
  styleUrls: ['./products-settings-type.component.scss']
})
export class ProductsSettingsTypeComponent implements OnInit {
  list: Array<ProductType> = [];
  showAdd: boolean = false;
  showPreloader: boolean = true;
  filter: ProductTypeFilter = new ProductTypeFilter();
  sub: Subscription = new Subscription();
  constructor(private productService: ProductService,
    private inventoryStateService: InventoryStateService
  ) { }

  ngOnInit() {
    if (this.inventoryStateService.getListTypes().length === 0) {
      this.inventoryStateService.onInitGetServiceTypeList();
    } else {
      this.list = this.inventoryStateService.getListTypes().sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
    }
    let onGetServiceType = this.inventoryStateService.onGetListType.subscribe(data => {
      this.list = data.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));;
      this.showPreloader = false;
    })
    this.sub.add(onGetServiceType);
  }
  onFilter(field) {
    this.filter.onFilter(field, this.list);
  }
  onEditType(item, event) {
    if (item.isInitEdit) {
      if (item.length === 0 || item.disableUpdate || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.productService.editProductType(item.id, item.title).pipe(map((res) => res),
        catchError(error => of(undefined))).subscribe(data => {
          item.setIsInitRequest(false);
          item.onInitEdit(false);
          if (event) event.target.blur();
        }, err => {
          item.setIsInitRequest(false);
        })
    }
  }
  public toggleShowAdd(data) {
    this.showAdd = data;
  }
}
