import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuoteProduct } from '../../class/quote-product';
import { QuoteStateService } from '../../quote-create/quote-state.service';

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
  removeProduct() {
    this.onRemoveProduct.emit(null);
  }
  getPriceProduct(product) {
    product.sum = this.quoteStateService.getPrice(product.sale, product.quantity, product.taxes) + product.taxes.reduce((a, b) => a + (b.rate * product.quantity), 0);;
    product.taxSum =  product.taxes.reduce((a, b) => a + (b.rate * product.quantity), 0);
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
}
