import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { QuoteAddProduct } from '../../class/quote-add-product';

@Component({
  selector: 'app-product-item-quote',
  templateUrl: './product-item-quote.component.html',
  styleUrls: ['./product-item-quote.component.scss']
})
export class ProductItemQuoteComponent implements OnInit {
  @Input() product: QuoteAddProduct;
  @Output() onRemoveProduct = new EventEmitter<any>();
  constructor(private quoteStateService: QuoteStateService,
    private permissionsService: PermissionsService,) { }

  ngOnInit() {
    this.product.markup = this.getMarkups();
  }
  ngDoCheck() {
    this.product.sum = (this.product.quantity * this.product.item.sale)
    this.product.taxSum = this.getTaxPrice();
  }
  public getTaxPrice() {
    return this.product.item.taxes.reduce((a, b) => a + ((b.rate / 100) * this.product.item.sale * this.product.quantity), 0);;
  }
  changeSales(val) {
    let value = Number(val.target.value);
    this.product.item.sale = value;
    this.product.item.sale_str = value.toFixed(2);
    this.product.markup = this.getMarkups();
  }
  changeCost(val) {
    let value = Number(val.target.value);
    this.product.item.cost = value;
    this.product.item.cost_str = value.toFixed(2);
    this.product.markup = this.getMarkups();
  }
  public getMarkups() {
    if (this.product.item.sale > 0 && this.product.item.cost > 0) return Number(this.quoteStateService.roundToTwo((this.product.item.sale - this.product.item.cost) / this.product.item.cost * 100));
    return 0;
  }
  changeMarkup(val) {
    let value = Number(val);
    this.product.item.sale = Number(this.quoteStateService.roundToTwo((value * this.product.item.cost / 100 + this.product.item.cost)));
    this.product.item.sale_str = this.product.item.sale.toFixed(2);
    this.product.markup = value;
  }
  removeProduct() {
    this.onRemoveProduct.emit(null);
  }
  getPriceProduct() {
    return this.quoteStateService.roundToTwo(this.product.sum);
  }
  onCheckSaleCost() {
    this.product.checkSaleCost();
  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }

  private isInteger(num): boolean {
    return (num ^ 0) === num;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
