import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InventoryItem } from 'src/ng2/app/components/inventory/class/inventory-item';
import { ContractsOtherProduct } from '../../class/contracts-other-product';

@Component({
  selector: 'app-contracts-aside-other-product',
  templateUrl: './contracts-aside-other-product.component.html',
  styleUrls: ['./contracts-aside-other-product.component.scss']
})
export class ContractsAsideOtherProductComponent implements OnInit {
  @Input() product: ContractsOtherProduct;
  editProduct: InventoryItem;
  @Output() onRemove = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    if (this.product.productId.length > 0) this.editProduct = new InventoryItem(this.product);
  }
  public onChangeProduct(data) {
    this.editProduct = data;
    if (data) {
      this.product.quantity = 0;
      this.product.salePrice = data.sale;
      this.product.productId = data.versionedId.id;
      this.product.validate = true;
      this.product.description = data.description;
    } else {
      this.product.quantity = 0;
      this.product.salePrice = 0;
      this.product.productId = "";
      this.product.description = null;
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
