import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DELETE_CATEGORIES_PRODUCT, DELETE_CATEGORY_PRODUCT } from 'src/app/const/confirm';
import { ProductService } from 'src/app/services/product/product.service';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { GlNumber } from '../../reports/class/gl-number';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { CategoryProductSettings } from './class/category-product-settings';
import { ProductsCategoryFilter } from './class/products-category-filter';
import { ProductsSettingsTypeComponent } from './products-settings-type/products-settings-type.component';
import { ProductsSettingsCategoryComponent } from './products-settings-category/products-settings-category.component';

@Component({
  selector: 'products-settings',
  templateUrl: './products-settings.component.html',
  styleUrls: ['./products-settings.component.scss']
})
export class ProductsSettingsComponent implements OnInit, OnDestroy {
  activeTab: string = "productCategories";
  loading: boolean = true;
  sub: Subscription = new Subscription();
  @ViewChild("productType") productType: ProductsSettingsTypeComponent;
  @ViewChild("categories") categories: ProductsSettingsCategoryComponent;
  constructor(private inventoryStateService: InventoryStateService,
    private confirmStateService: ConfirmStateService,
    private productService: ProductService,
    public cd: ChangeDetectorRef,
    private glNumberStateService: GlNumberStateService,
    private modalService: NgbModal,) { }


  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');

  }
  setPreloader(data) {
    this.loading = data;
  }
  parseAddText() {
    if (this.activeTab === "productType") return "Add Type";
    if (this.activeTab === "productCategories") return "Add category";
    return "";
  }

  removeCategoriesStatus() {
    this.confirmStateService.setConfirmAction(DELETE_CATEGORIES_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove Product Category`;

  }

  getSelectedCount() {
    return this.inventoryStateService.getListCategoriesForRemove().length;
  }

  create() {
    if (this.activeTab === "productCategories") this.categories.showAddCategory = true;
    if (this.activeTab === "productType") this.productType.toggleShowAdd(true);
  }
  setTab(data) {
    this.activeTab = data['nextId'];
  }


  ngOnDestroy(): void {
    $('body').removeClass('page-settings');
    this.inventoryStateService.setListCategoriesForRemove([]);
    this.sub.unsubscribe();
  }
}
