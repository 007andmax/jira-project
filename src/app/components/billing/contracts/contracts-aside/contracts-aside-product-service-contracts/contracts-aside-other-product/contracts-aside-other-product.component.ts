import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InventoryItem } from 'src/app/components/inventory/class/inventory-item';
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
    this.onChangeTaxSum();
  }
  public onChangeProduct(data) {
    this.editProduct = data;
    if (data) {
      this.product.quantity = 1;
      this.product.salePrice = data.sale;
      this.product.salePrice_str = data.sale.toFixed(2);
      this.product.productId = data.versionedId.id;
      this.product.validate = true;
      this.product.description = data.description;
      this.product.taxes = data.taxes;
      this.onChangeTaxSum();
    } else {
      this.product.quantity = 0;
      this.product.salePrice = 0;
      this.product.salePrice_str = "0.00";
      this.product.productId = "";
      this.product.description = null;
      this.product.taxSum = 0;
      this.product.taxes = [];
    }
  }
  onChangeDiscountAmount(event) {
    this.product.discountAmount = event;
    this.onChangeTaxSum();
  }
  public onChangeTaxSum() {
    let rate = this.product.taxes.map(item => item.rate).reduce((a, b) => a + b, 0);
    this.product.taxSum = (this.product.salePrice * this.product.quantity * (1 - (Number(this.product.discountAmount) || 0) / 100) * rate / 100);
  }
  public onChangeQuantity(val) {
    let value = Number(val);
    this.product.quantity = value;
    this.onChangeTaxSum();
  }
  public onChangeSalePrice(val) {
    let value = Number(val);
    this.product.salePrice = value;
    this.onChangeTaxSum();
  }
  getSubTotal() {
    return ((this.product.quantity * this.product.salePrice) - this.calculateDiscount()).toFixed(2);
  }
  public calculateDiscount() {
    return (this.product.quantity * this.product.salePrice * (Number(this.product.discountAmount) || 0) / 100);
  }
  remove() {
    this.onRemove.emit(null);
  }
}
