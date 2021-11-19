import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DELETE_CATEGORIES_PRODUCT, DELETE_CATEGORY_PRODUCT } from 'src/app/const/confirm';
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
    public cd: ChangeDetectorRef,
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
        if (this.confirmStateService.getConfirmAction() === DELETE_CATEGORIES_PRODUCT) {
          this.onRemoveCategoriesProduct();
        }
      }
    })
    this.sub.add(getConfirm);
  }
  onSelect(event, item) {
    if (event.target.checked) {
      this.inventoryStateService.getListCategoriesForRemove().push(item);
    } else {
      let list = this.inventoryStateService.getListCategoriesForRemove();
      let index = list.findIndex(item => item.id === item.id);
      if (index > -1) list.splice(index, 1);
      this.inventoryStateService.setListCategoriesForRemove(list);
    }
    this.cd.detectChanges();
  }
  public getCategories(data) {
    this.categoriesProducts = JSON.parse(JSON.stringify(data)).map(item => new CategoryProductSettings(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  getSelectedCount() {
    return this.inventoryStateService.getListCategoriesForRemove().length;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.categoriesProducts);
  }
  create() {
    if (this.activeTab === "productCategories") this.showAddCategory = true;

  }
  onRemoveCategoriesProduct() {
    forkJoin(this.inventoryStateService.getListCategoriesForRemove().map(item => this.productService.removeCategory(item.id).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
          this.inventoryStateService.setListCategoriesForRemove([]);
          this.cd.detectChanges();
        },
        error => {
        }
      );
  }
  onRemoveCategoryProduct(id) {
    this.productService.removeCategory(id).pipe(map((res) => res),
      catchError(error => of(undefined)))
      .subscribe(
        () => {

        },
        error => {
        }
      )
  }
  onEditCategory(item) {
    if (item.isInitEdit) {
      if (item.length === 0) return;
      this.productService.editCategory(item.id, item.name).pipe(map((res) => res),
        catchError(error => of(undefined)))
        .subscribe(
          () => {
            item.onInitEdit(false);
          })
    }
  }
  removeCategoriesStatus() {
    this.confirmStateService.setConfirmAction(DELETE_CATEGORIES_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete categories?`;

  }
  removeCategoryProduct(data) {
    this.confirmStateService.setConfirmAction(DELETE_CATEGORY_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete this category?`;
    this.inventoryStateService.setCategoryForDelete(data);
  }



  ngOnDestroy(): void {
    $('body').removeClass('ng7');
    this.inventoryStateService.setListCategoriesForRemove([]);
    this.sub.unsubscribe();
  }
}
