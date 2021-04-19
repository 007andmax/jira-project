import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Service } from 'src/app/interfaces/service/service';
import { QuoteService } from 'src/app/services/quote/quote.service';

@Component({
  selector: 'app-service-list-quote',
  templateUrl: './service-list-quote.component.html',
  styleUrls: ['./service-list-quote.component.scss']
})
export class ServiceListQuoteComponent implements OnInit {
  @Input() quoteCompany: any;
  @Input() services: Array<Service> = [];
  @Output() onSelect = new EventEmitter<any>();
  constructor(private quoteServices: QuoteService) { }

  ngOnInit() {
  }
  resetServicesList() {
    this.services = [];
  }
  getServicesList() {
    this.quoteServices.getServiceList(this.quoteCompany.id).subscribe((res: any) => {
      this.services = res;
    });
  }
  select(data) {
    this.onSelect.emit(data);
  }
}
