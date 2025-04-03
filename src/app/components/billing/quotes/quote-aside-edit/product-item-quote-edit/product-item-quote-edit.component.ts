import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { QuoteProduct } from '../../class/quote-product';

@Component({
  selector: 'app-product-item-quote-edit',
  templateUrl: './product-item-quote-edit.component.html',
  styleUrls: ['./product-item-quote-edit.component.scss']
})
export class ProductItemQuoteEditComponent implements OnInit {
  @Input() product: QuoteProduct;
  @Output() onRemoveProduct = new EventEmitter<any>();
  constructor(private quoteStateService: QuoteStateService,
    private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.product.markup = this.getMarkups();
  }
  ngDoCheck() {
    this.product.sum = this.product.quantity * this.product.sale;
    this.product.taxSum = this.getTaxPrice();
  }
  public getTaxPrice() {
    return this.product.taxes.reduce((a, b) => a + ((b.rate / 100) * this.product.sale * this.product.quantity), 0);;
  }
  changeSales(val) {
    let value = Number(val.target.value);
    this.product.sale = value;
    this.product.sale_str = value.toFixed(2);
    this.product.markup = this.getMarkups();
  }
  changeCost(val) {
    let value = Number(val.target.value);
    this.product.cost = value;
    this.product.cost_str = value.toFixed(2);
    this.product.markup = this.getMarkups();
  }
  public getMarkups() {
    if (this.product.sale > 0 && this.product.cost > 0) return Number(this.quoteStateService.roundToTwo((this.product.sale - this.product.cost) / this.product.cost * 100));
    return 0;
  }
  changeMarkup(val) {
    let value = Number(val);
    this.product.sale = Number(this.quoteStateService.roundToTwo((value * this.product.cost / 100 + this.product.cost)));
    this.product.sale_str = this.product.sale.toFixed(2);
    this.product.markup = value;
  }
  removeProduct() {
    this.onRemoveProduct.emit(null);
  }
  getPriceProduct() {
    return this.quoteStateService.roundToTwo(this.product.quantity * this.product.sale);
  }
  onCheckSaleCost() {
    this.product.checkSaleCost();
  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
