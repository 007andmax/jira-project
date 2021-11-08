import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DELETE_CATEGORY_PRODUCT } from 'src/app/const/confirm';
import { CategoryProduct } from 'src/app/interfaces/product/category-product';
import { ModalEditCategoryProductComponent } from 'src/app/services/modal/modal-edit-category-product/modal-edit-category-product.component';
import { ProductService } from 'src/app/services/product/product.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { CategoryProductSettings } from './class/category-product-settings';
import { ProductsCategoryFilter } from './class/products-category-filter';

@Component({
  selector: 'products-settings',
  templateUrl: './products-settings.component.html',
  styleUrls: ['./products-settings.component.scss']
})
export class ProductsSettingsComponent implements OnInit, OnDestroy {
  activeTab: string = "productCategories";
  showAddCategory: boolean = false;
  filter: ProductsCategoryFilter = new ProductsCategoryFilter();
  categoriesProducts: Array<CategoryProductSettings> = [];

  sub: Subscription = new Subscription();
  constructor(private inventoryStateService: InventoryStateService,
    private confirmStateService: ConfirmStateService,
    private productService: ProductService,
    private modalService: NgbModal,) { }


  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.getCategories(this.inventoryStateService.getCategories());
    this.inventoryStateService.onGetCategories.subscribe(data => {
      this.getCategories(data);
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_CATEGORY_PRODUCT) {
          this.onRemoveCategoryProduct(this.inventoryStateService.getCategoryForDelete().id);
        }
      }
    })
    this.sub.add(getConfirm);
  }
  public getCategories(data) {
    this.categoriesProducts = JSON.parse(JSON.stringify(data)).map(item => new CategoryProductSettings(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  onFilter(field) {
    this.filter.onFilter(field, this.categoriesProducts);
  }
  create() {
    if (this.activeTab === "productCategories") this.showAddCategory = true;

  }

  onRemoveCategoryProduct(id) {
    this.productService.removeCategory(id).subscribe(data => {

    })
  }
  onEditCategory(item) {
    if (item.isInitEdit) {
      if (item.length === 0) return;
      this.productService.editCategory(item.id, item.name).subscribe(data => {
        item.onInitEdit(false);
      })
    }
  }

  removeCategoryProduct(data) {
    this.confirmStateService.setConfirmAction(DELETE_CATEGORY_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete this category?`;
    this.inventoryStateService.setCategoryForDelete(data);
  }



  ngOnDestroy(): void {
    $('body').removeClass('ng7');
    this.sub.unsubscribe();
  }
}
