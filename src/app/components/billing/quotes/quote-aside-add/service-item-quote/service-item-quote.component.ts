import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Service } from 'src/app/interfaces/service/service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { QuoteAddService } from '../../class/quote-add-service';

@Component({
  selector: 'app-service-item-quote',
  templateUrl: './service-item-quote.component.html',
  styleUrls: ['./service-item-quote.component.scss']
})
export class ServiceItemQuoteComponent implements OnInit {
  @Input() service: QuoteAddService;
  @Input() services: Array<Service> = [];
  @Output() onRemoveService = new EventEmitter<any>();

  constructor(private quoteStateService: QuoteStateService,) { }

  ngOnInit() {
  }
  getPriceService(service) {
    let rate = service.item.taxes.map(item => item.rate).reduce((a, b) => a + b, 0);
    if (service.discountType == "PERCENT") service.sum = (((service.quantity * service.item.rate) * rate / 100 + (service.quantity * service.item.rate)) * (1 - (Number(service.discountAmount) || 0) / 100));
    if (service.discountType == "FIXED") service.sum = (((service.quantity * service.item.rate) * rate / 100 + (service.quantity * service.item.rate)) - Number(service.discountAmount));
    if (!service.discountType) service.sum = (((service.quantity * service.item.rate) * rate / 100 + (service.quantity * service.item.rate)));
    service.taxSum = this.getTaxPrice(service);
    return this.quoteStateService.roundToTwo(((service.quantity * service.item.rate) * rate / 100 + (service.quantity * service.item.rate)));
  }
  public getTaxPrice(service) {
    let rate = service.item.taxes.map(item => item.rate).reduce((a, b) => a + b, 0);
    if (service.discountType == "PERCENT") return (service.item.rate * service.quantity * (1 - (Number(service.discountAmount) || 0) / 100) * rate / 100);
    if (service.discountType == "FIXED") return (((service.item.rate * service.quantity) - Number(service.discountAmount)) * rate / 100);
    return (service.item.rate * service.quantity * rate / 100);
  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
  onSelectService(data) {
    this.service.setItem(data);
    this.service.setValdiate(true);
  }
  removeService() {
    this.onRemoveService.emit(null);
  }
}
