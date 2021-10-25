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

@Component({
  selector: 'customizable-lists',
  templateUrl: './customizable-lists.component.html',
  styleUrls: ['./customizable-lists.component.scss']
})
export class CustomizableListsComponent implements OnInit, OnDestroy {
  categoriesProducts: Array<CategoryProduct> = [];
  sub: Subscription = new Subscription();
  constructor(private inventoryStateService: InventoryStateService,
    private confirmStateService: ConfirmStateService,
    private productService: ProductService,
    private modalService: NgbModal,) { }


  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.categoriesProducts = this.inventoryStateService.getCategories();
    this.inventoryStateService.onGetCategories.subscribe(data => {
      this.categoriesProducts = data;
      console.log("this.categoriesProducts", this.categoriesProducts);
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
  onRemoveCategoryProduct(id) {
    this.productService.removeCategory(id).subscribe(data => {

    })
  }
  editCategoryProduct(data) {
    const modalRef = this.modalService.open(ModalEditCategoryProductComponent, { windowClass: 'quote-send-modal' });
    modalRef.componentInstance.categoryProduct = data;
  }
  remove(data) {
    this.confirmStateService.setConfirmAction(DELETE_CATEGORY_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete this category?`;
    this.inventoryStateService.setCategoryForDelete(data);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
