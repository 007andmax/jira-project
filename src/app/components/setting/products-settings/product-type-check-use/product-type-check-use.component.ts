import { Component, OnInit } from '@angular/core';
import { ProductType } from '../class/product-type';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product/product.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { InventoryItem } from 'src/app/components/inventory/class/inventory-item';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';

@Component({
  selector: 'app-product-type-check-use',
  templateUrl: './product-type-check-use.component.html',
  styleUrls: ['./product-type-check-use.component.scss']
})
export class ProductTypeCheckUseComponent implements OnInit {
  showPreloader: boolean = false;
  valid: boolean = true;
  productType: ProductType;
  products: Array<InventoryItem> = [];
  listTypes: Array<ProductType> = [];
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
    /* let onRefreshGlNumbersCheck = this.glNumberStateService.onRefreshGlNumbersCheck.subscribe(data => {
       this.showPreloader = true;
       this.glNumberService.validateForRemove(this.glNumber.id).subscribe((data: any) => {
         this.getGlNumber(data);
       });
     })
     this.sub.add(onRefreshGlNumbersCheck);*/
  }


  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };

  approveConfirm() {
    this.showPreloader = true;
    this.productService.removeProductType(this.productType.id).subscribe((data: any) => {
      this.showPreloader = false;
      this.cancelConfirm();
    }, err => {
      this.showPreloader = false;
      this.valid = false;
      console.log("err", err);
    })
  };
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
