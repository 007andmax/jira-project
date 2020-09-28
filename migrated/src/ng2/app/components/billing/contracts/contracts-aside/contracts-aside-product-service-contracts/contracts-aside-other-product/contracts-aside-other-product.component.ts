import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/ng2/app/interfaces/product/product';
import { ContractsOtherProduct } from '../../class/contracts-other-product';

@Component({
  selector: 'app-contracts-aside-other-product',
  templateUrl: './contracts-aside-other-product.component.html',
  styleUrls: ['./contracts-aside-other-product.component.scss']
})
export class ContractsAsideOtherProductComponent implements OnInit {
  @Input() product: ContractsOtherProduct;
  @Output() onRemove = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  public onChangeProduct(data) {
    console.log("data", data);
    this.product.description = data.description;
    this.product.quantity ="0";
    this.product.salePrice = data.sale;
    this.product.productId = data.versionedId.id;
  }
  public onChangeSalePrice(val) {
    let value = Number(val);
    this.product.salePrice = value;
  }
  remove() {
    this.onRemove.emit(null);
  }
}
