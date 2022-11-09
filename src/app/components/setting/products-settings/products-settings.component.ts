import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'products-settings',
  templateUrl: './products-settings.component.html',
  styleUrls: ['./products-settings.component.scss']
})
export class ProductsSettingsComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  activeTab: string = "productCategories";
  showAddCategory: boolean = false;
  filter: ProductsCategoryFilter = new ProductsCategoryFilter();
  categoriesProducts: Array<CategoryProductSettings> = [];
  sub: Subscription = new Subscription();
  glNumbers: Array<GlNumber> = [];
  constructor(private inventoryStateService: InventoryStateService,
    private confirmStateService: ConfirmStateService,
    private productService: ProductService,
    public cd: ChangeDetectorRef,
    private glNumberStateService: GlNumberStateService,
    private modalService: NgbModal,) { }


  ngOnInit() {
    $('body').addClass('page-settings');
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
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
    })
  }
  private sortGlNumbers(data) {
    this.loading = false;
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  glDropDownItemName(item) {
    return `${item["glNumber"]} - ${(item["description"] && item["description"].length > 0) ? item["description"]
      : "No description"}`;
  }
  onSelectAll(event) {
    if (event.target.checked) {
      this.categoriesProducts.forEach(item => {
        if (item.productsAmount === 0) {
          item.selected = true;
          this.inventoryStateService.getListCategoriesForRemove().push(item);
        }
      })
    } else {
      this.categoriesProducts.forEach(item => (item.selected = false));
      this.inventoryStateService.setListCategoriesForRemove([]);
    }
    this.cd.detectChanges();
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
          this.inventoryStateService.setListCategoriesForRemove([]);
          this.cd.detectChanges();
        },
        error => {
        }
      )
  }
  onSelectGlNumbers(item, glNumber) {
    this.productService.setGlNumberCategory(item.id, (glNumber) ? { id: glNumber.id } : null)
      .subscribe(
        () => {

        })
  }
  onEditCategory(item) {
    if (item.isInitEdit) {
      if (item.length === 0 || item.disableUpdate || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.productService.editCategory(item.id, item.name).pipe(map((res) => res),
        catchError(error => of(undefined)))
        .subscribe(
          () => {
            item.setIsInitRequest(false);
            item.onInitEdit(false);
          }, err => {
            item.setIsInitRequest(false);
          })
    }
  }
  removeCategoriesStatus() {
    this.confirmStateService.setConfirmAction(DELETE_CATEGORIES_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove Product Category`;

  }
  removeCategoryProduct(data) {
    this.confirmStateService.setConfirmAction(DELETE_CATEGORY_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove Product Category`;
    this.inventoryStateService.setCategoryForDelete(data);
  }



  ngOnDestroy(): void {
    $('body').removeClass('page-settings');
    this.inventoryStateService.setListCategoriesForRemove([]);
    this.sub.unsubscribe();
  }
}
