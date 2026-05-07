import { Component, Input, OnInit } from '@angular/core';
import { InventoryValidate } from 'src/app/components/inventory/class/inventory-validate';
import { TicketProfileProduct } from 'src/app/components/tickets/tickets/class/ticket-profile-product';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';

@Component({
  selector: 'app-ticket-preview-report-product-item',
  templateUrl: './ticket-preview-report-product-item.component.html',
  styleUrls: ['./ticket-preview-report-product-item.component.scss']
})
export class TicketPreviewReportProductItemComponent implements OnInit {

  @Input() product: TicketProfileProduct;
  markup: number;
  validate: InventoryValidate = new InventoryValidate();
  constructor(
    private quoteStateService: QuoteStateService) { }
  ngOnInit(): void {
    this.markup = this.getMarkups();
  }
  onChangeCost(val) {
    let value = Number(val);
    this.product.item.cost = value;
    this.product.item.cost_str = value.toFixed(2);
    this.markup = this.getMarkups();
  }
  onChangeSale(val) {
    let value = Number(val);
    this.product.item.sale = value;
    this.product.item.sale_str = value.toFixed(2);
    this.markup = this.getMarkups();
  }
  changeMarkup(val) {
    let value = Number(val);
    this.product.item.sale = Number(this.quoteStateService.roundToTwo((value * this.product.item.cost / 100 + this.product.item.cost)));
    this.product.item.sale_str = this.product.item.sale.toFixed(2);
    this.markup = value;
  }
  public getMarkups() {
    if (this.product.item.sale > 0 && this.product.item.cost > 0) return Number(this.quoteStateService.roundToTwo((this.product.item.sale - this.product.item.cost) / this.product.item.cost * 100));
    return 0;
  }
}
