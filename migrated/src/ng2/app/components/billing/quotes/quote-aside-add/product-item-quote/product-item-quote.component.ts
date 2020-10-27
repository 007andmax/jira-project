import { Component, Input, OnInit } from '@angular/core';
import { QuoteAddProduct } from '../../class/quote-add-product';
import { QuoteStateService } from '../../quote-create/quote-state.service';

@Component({
  selector: 'app-product-item-quote',
  templateUrl: './product-item-quote.component.html',
  styleUrls: ['./product-item-quote.component.scss']
})
export class ProductItemQuoteComponent implements OnInit {
  @Input() product: QuoteAddProduct;
  constructor(  private quoteStateService: QuoteStateService,) { }

  ngOnInit() {

  }
  getPriceProduct(product) {
    product.sum = this.quoteStateService.getPrice(product.item.sale, product.quantity, product.item.taxes) + product.item.taxes.reduce((a, b) => a + (b.rate * product.quantity), 0);;
    product.taxSum =  product.item.taxes.reduce((a, b) => a + (b.rate * product.quantity), 0);
    return this.quoteStateService.roundToTwo(this.quoteStateService.getPrice(product.item.sale, product.quantity, product.item.taxes) + product.item.taxes.reduce((a, b) => a + (b.rate * product.quantity), 0));
  }
  onCheckSaleCost() {
    this.product.checkSaleCost();
  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
}
