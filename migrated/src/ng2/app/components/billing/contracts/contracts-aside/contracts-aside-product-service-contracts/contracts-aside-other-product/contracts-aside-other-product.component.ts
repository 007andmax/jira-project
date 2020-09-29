import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InventoryItem } from 'src/ng2/app/components/inventory/class/inventory-item';
import { Product } from 'src/ng2/app/interfaces/product/product';
import { ContractsOtherProduct } from '../../class/contracts-other-product';

@Component({
  selector: 'app-contracts-aside-other-product',
  templateUrl: './contracts-aside-other-product.component.html',
  styleUrls: ['./contracts-aside-other-product.component.scss']
})
export class ContractsAsideOtherProductComponent implements OnInit {
  @Input() product: ContractsOtherProduct;
  editProduct: InventoryItem;
  @Input() productsList: Array<InventoryItem> = [];
  @Output() onRemove = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
   this.editProduct = this.productsList.find(item => item.versionedId.id === this.product.productId);
   console.log("this.editProduct",this.editProduct);
   console.log("this.productsList",this.productsList);
  }
  public onChangeProduct(data) {
    console.log("data", data);
    if (data) {
     
      this.product.quantity = 0;
      this.product.salePrice = data.sale;
      this.product.productId = data.versionedId.id;
      this.product.validate = true;
    } else {
     
      this.product.quantity = 0;
      this.product.salePrice = 0;
      this.product.productId = "";
    }

  }
  public onChangeQuantity(val) {
    let value = Number(val);
    this.product.quantity = value;
  }
  public onChangeSalePrice(val) {
    let value = Number(val);
    this.product.salePrice = value;
  }
  remove() {
    this.onRemove.emit(null);
  }
}
