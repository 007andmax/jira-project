import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Service } from 'src/ng2/app/interfaces/service/service';
import { QuoteStateService } from 'src/ng2/app/states/quote/quote-state.service';
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
    service.sum = this.quoteStateService.getPrice(service.item.rate, service.quantity, service.item.taxes) + this.getTaxPrice(service);
    service.taxSum = this.getTaxPrice(service);
    return this.quoteStateService.roundToTwo(this.quoteStateService.getPrice(service.item.rate, service.quantity, service.item.taxes) + this.getTaxPrice(service));
  }
  public getTaxPrice(service) {
    return service.item.taxes.reduce((a, b) => a + ((b.rate / 100) * service.item.rate * service.quantity), 0);;
  }
  getSelectedTaxes(taxes) {
    return taxes.map(item => {
      return `${item.name} ${item.rate}%`;
    }).join("<br>");
  }
  onSelectService(data) {
    console.log("data", data);
    this.service.setItem(data);
    this.service.setValdiate(true);
  }
  removeService() {
    this.onRemoveService.emit(null);
  }
}
