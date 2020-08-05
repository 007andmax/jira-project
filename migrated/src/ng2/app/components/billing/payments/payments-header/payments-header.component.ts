import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { PaymentsFilterComponent } from './payments-filter/payments-filter.component';

@Component({
  selector: 'app-payments-header',
  templateUrl: './payments-header.component.html',
  styleUrls: ['./payments-header.component.scss']
})
export class PaymentsHeaderComponent implements OnInit {

  @ViewChild('filter') filter: PaymentsFilterComponent;
  countFilter: number = 0;

  toggleFilter: boolean = true;
  @Output() onCreateInvoice = new EventEmitter<any>();
  @Output() onSortBy = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  sortBy(data) {
    this.onSortBy.emit(data);
  }
  clearAll() {
    this.filter.onClearAll();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  onShowCreateInvoice() {
    this.onCreateInvoice.emit(null);
  }
}
