import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuoteStateService } from 'src/ng2/app/states/quote/quote-state.service';
import { QuoteAddProduct } from '../../class/quote-add-product';

@Component({
  selector: 'app-product-item-quote',
  templateUrl: './product-item-quote.component.html',
  styleUrls: ['./product-item-quote.component.scss']
})
export class ProductItemQuoteComponent implements OnInit {
  @Input() product: QuoteAddProduct;
  @Output() onRemoveProduct = new EventEmitter<any>();
  constructor(private quoteStateService: QuoteStateService,) { }

  ngOnInit() {
    this.product.markup = this.getMarkups();
  }
  ngDoCheck() {
    this.product.sum = this.quoteStateService.getPrice(this.product.item.sale, this.product.quantity, this.product.item.taxes) + this.getTaxPrice();
    this.product.taxSum = this.getTaxPrice();
  }
  public getTaxPrice() {
    return this.product.item.taxes.reduce((a, b) => a + ((b.rate / 100) * this.product.item.sale * this.product.quantity), 0);;
  }
  changeSales(val) {
    let value = Number(val);
    this.product.item.sale = value;
    this.product.markup = this.getMarkups();
  }
  changeCost(val) {
    let value = Number(val);
    this.product.item.cost = value;
    this.product.markup = this.getMarkups();
  }
  public getMarkups() {
    if (this.product.item.sale > 0 && this.product.item.cost > 0) return Math.round((this.product.item.sale - this.product.item.cost) / this.product.item.cost * 100);
    return 0;
  }
  changeMarkup(val) {
    let value = Number(val);
    this.product.item.sale = Number(this.quoteStateService.roundToTwo((value * this.product.item.cost / 100 + this.product.item.cost)));
    this.product.markup = this.roundingMarkup(value);
  }
  removeProduct() {
    this.onRemoveProduct.emit(null);
  }
  getPriceProduct(product) {
    return this.quoteStateService.roundToTwo(this.quoteStateService.getPrice(product.item.sale, product.quantity, product.item.taxes) + this.getTaxPrice());
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
