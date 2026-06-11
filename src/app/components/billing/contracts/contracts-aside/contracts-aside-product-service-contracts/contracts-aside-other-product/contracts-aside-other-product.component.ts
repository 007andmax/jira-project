import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InventoryItem } from 'src/app/components/inventory/class/inventory-item';
import { ContractsOtherProduct } from '../../class/contracts-other-product';
import { CurrencyPipe } from '@angular/common';
import { ContractsAsideDiscountComponent } from '../../contracts-aside-discount/contracts-aside-discount.component';
import { ToFixedDirective } from '../../../../../../directives/to-fixed/to-fixed.directive';
import { DecimalNumberDirective } from '../../../../../../directives/decimal-number/decimal-number.directive';
import { ProductListComponent } from '../../../../../shared/product-list/product-list.component';

@Component({
    selector: 'app-contracts-aside-other-product',
    templateUrl: './contracts-aside-other-product.component.html',
    styleUrls: ['./contracts-aside-other-product.component.scss'],
    standalone: true,
    imports: [ProductListComponent, DecimalNumberDirective, ToFixedDirective, ContractsAsideDiscountComponent, CurrencyPipe]
})
export class ContractsAsideOtherProductComponent implements OnInit {
  @Input() product: ContractsOtherProduct;
  editProduct: InventoryItem;
  @Output() onRemove = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    if (this.product.versionedId) this.editProduct = new InventoryItem(this.product);
  }
  public onChangeProduct(data) {
    this.editProduct = data;
    if (data) {
      this.product.quantity = 1;
      this.product.salePrice = data.sale;
      this.product.salePrice_str = data.sale.toFixed(2);
      this.product.versionedId = data.versionedId;
      this.product.validate = true;
      this.product.description = data.description;
      this.product.taxes = data.taxes;
    } else {
      this.product.quantity = 0;
      this.product.salePrice = 0;
      this.product.salePrice_str = "0.00";
      this.product.versionedId = null;
      this.product.description = null;
      this.product.taxSum = 0;
      this.product.taxes = [];
    }
  }
  ngDoCheck() {
    this.onChangeTaxSum();
  }

  onChangeDiscount(data) {
    this.product.discountType = data.type;
  }
  public onChangeTaxSum() {
    let rate = this.product.taxes.map(item => item.rate).reduce((a, b) => a + b, 0);
    if (this.product.discountType == "PERCENT") this.product.taxSum = (this.product.salePrice * this.product.quantity * (1 - (Number(this.product.discountAmount) || 0) / 100) * rate / 100);
    if (this.product.discountType == "FIXED") this.product.taxSum = (((this.product.salePrice * this.product.quantity) - Number(this.product.discountAmount)) * rate / 100);
  }
  public onChangeQuantity(val) {
    let value = Number(val);
    this.product.quantity = value;
  }
  public onChangeSalePrice(val) {
    let value = Number(val);
    this.product.salePrice = value;
  }
  public getSubTotal() {
    if (this.product.discountType == "PERCENT") return (this.product.salePrice * this.product.quantity * (1 - (Number(this.product.discountAmount) || 0) / 100));
    if (this.product.discountType == "FIXED") return (((this.product.salePrice * this.product.quantity) - Number(this.product.discountAmount)));
  }
  remove() {
    this.onRemove.emit(null);
  }
}
