import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { CategoryProduct } from 'src/ng2/app/interfaces/product/category-product';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DELETE_COMPANY } from 'src/ng2/app/const/confirm';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { InventoryStateService } from 'src/ng2/app/states/inventory/inventory-state.service';

@Component({
  selector: 'app-left-panel-inventory',
  templateUrl: './left-panel-inventory.component.html',
  styleUrls: ['./left-panel-inventory.component.scss']
})
export class LeftPanelInventoryComponent implements OnInit {
  inventoryCategoryList: Array<CategoryProduct> = [];
  countOfCategories: number = 10;
  sortCategoty: CategoryProduct = null;
  constructor(private productService: ProductService,
    private confirmStateService: ConfirmStateService,
    private inventoryStateService: InventoryStateService,
    private modalService: NgbModal, ) { }

  ngOnInit() {
    this.productService.getCategoriesProducts().subscribe(data => {
      this.inventoryCategoryList = data;
      console.log("this.inventoryCategoryList", this.inventoryCategoryList.length);
    })
  }
  selectCategory(category) {
    this.sortCategoty = category;
    this.inventoryStateService.setSortCategory(category);
  }
  getAllProductsCount() {
    let count = 0;
    this.inventoryCategoryList.map((item) => {
      count += item.productsAmount;
    });
    return count;
  };
  changeShowAllCategories() {
    if (this.countOfCategories === 10) {
      this.countOfCategories = this.inventoryCategoryList.length;
    } else {
      this.countOfCategories = 10;
    }
  }
  deleteCategory(category) {
    this.confirmStateService.setConfirmAction(DELETE_COMPANY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete category?`;
    this.inventoryStateService.setCategoryForDelete(category);
  }
  public trackById(index, item) {
    return item.id;
  }

}
