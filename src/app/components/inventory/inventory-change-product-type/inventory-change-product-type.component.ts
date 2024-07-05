import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product/product.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { ProductType } from '../../setting/products-settings/class/product-type';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { InventoryItem } from '../class/inventory-item';

@Component({
  selector: 'app-inventory-change-product-type',
  templateUrl: './inventory-change-product-type.component.html',
  styleUrls: ['./inventory-change-product-type.component.scss']
})
export class InventoryChangeProductTypeComponent implements OnInit {
  showPreloader: boolean = false;
  selectedProductType: ProductType;
  products: Array<InventoryItem> = [];
  listTypes: Array<ProductType> = [];
  validate: boolean = true;
  sub: Subscription = new Subscription();
  constructor(private productService: ProductService,
    private confirmStateService: ConfirmStateService,
    public activeModal: NgbActiveModal,
    private inventoryStateService: InventoryStateService,
  ) { }

  ngOnInit() {
    if (this.inventoryStateService.getListTypes().length === 0) {
      this.inventoryStateService.onInitGetServiceTypeList();
    } else {
      this.listTypes = this.inventoryStateService.getListTypes().sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
    }
    let onGetServiceType = this.inventoryStateService.onGetListType.subscribe(data => {
      this.listTypes = data.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));;
    })
    this.sub.add(onGetServiceType);
  }

  onSelectProuctType(data) {
    this.selectedProductType = data;
    this.validate = true;
  }

  changeProductType() {
    if (this.selectedProductType) {
      this.showPreloader = true;
      this.productService.setProductType(this.selectedProductType.id, this.products.map(item => item.versionedId.id)).subscribe(data => {
        this.cancelConfirm();
      }, err => {
        this.showPreloader = false;
      })
    } else {
      this.validate = false;
    }
  }
  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
