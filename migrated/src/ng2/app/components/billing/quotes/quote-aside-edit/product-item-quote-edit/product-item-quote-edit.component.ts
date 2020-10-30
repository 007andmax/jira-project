import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuoteStateService } from 'src/ng2/app/states/quote/quote-state.service';
import { QuoteProduct } from '../../class/quote-product';


@Component({
  selector: 'app-product-item-quote-edit',
  templateUrl: './product-item-quote-edit.component.html',
  styleUrls: ['./product-item-quote-edit.component.scss']
})
export class ProductItemQuoteEditComponent implements OnInit {
  @Input() product: QuoteProduct;
  @Output() onRemoveProduct = new EventEmitter<any>();
  constructor(  private quoteStateService: QuoteStateService,) { }

  ngOnInit() {

  }
  ngDoCheck() {
    this.product.sum = this.quoteStateService.getPrice(this.product.sale, this.product.quantity, this.product.taxes) + this.product.taxes.reduce((a, b) => a + (b.rate * this.product.quantity), 0);;
    this.product.taxSum = this.product.taxes.reduce((a, b) => a + (b.rate * this.product.quantity), 0);

  }
  changeSales(val) {
    let value = Number(val);
    this.product.sale = value;
    this.product.markup = this.getMarkups();
  }
  changeCost(val) {
    let value = Number(val);
    this.product.cost = value;
    this.product.markup = this.getMarkups();
  }
  public getMarkups() {
    if (this.product.sale > 0 && this.product.cost > 0) return Math.round((this.product.sale - this.product.cost) / this.product.cost * 100);
    return 0;

  }
  changeMarkup(val) {
    let value = Number(val);
    this.product.sale = Number(this.quoteStateService.roundToTwo((value * this.product.cost / 100 + this.product.cost)));
    this.product.markup = this.roundingMarkup(value);
  }
  removeProduct() {
    this.onRemoveProduct.emit(null);
  }
  getPriceProduct(product) {
       return this.quoteStateService.roundToTwo(this.quoteStateService.getPrice(product.sale, product.quantity, product.taxes) + product.taxes.reduce((a, b) => a + (b.rate * product.quantity), 0));
  }
  onCheckSaleCost() {
    this.product.checkSaleCost();
  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
  private roundingMarkup(markup) {
    return (!this.isInteger(markup)) ? Math.ceil(markup * 10) / 10 : markup;
  }
  private isInteger(num): boolean {
    return (num ^ 0) === num;
  }
}
