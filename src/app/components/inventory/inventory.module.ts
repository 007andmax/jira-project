import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { InventoryHeaderComponent } from './inventory-header/inventory-header.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InventoryTableComponent } from './inventory-table/inventory-table.component';
import { FormsModule } from '@angular/forms';
import { InventoryFilterComponent } from './inventory-header/inventory-filter/inventory-filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InventoryAddCategoryComponent } from './inventory-add-category/inventory-add-category.component';
import { InventoryRoutingModule } from './inventory-routing.module';






import { InventoryChangeProductTypeComponent } from './inventory-change-product-type/inventory-change-product-type.component';




@NgModule({
    imports: [
    CommonModule,
    InfiniteScrollModule,
    FormsModule,
    NgbModule,
    InventoryRoutingModule,
    InventoryComponent,
    InventoryHeaderComponent,
    InventoryTableComponent,
    InventoryFilterComponent,
    InventoryAddCategoryComponent
],
})
export class InventoryModule { }
