import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { InvoicesFilter } from '../class/invoices-filter';
import { InvoicesFilterComponent } from './invoices-filter/invoices-filter.component';

@Component({
  selector: 'app-invoices-header',
  templateUrl: './invoices-header.component.html',
  styleUrls: ['./invoices-header.component.scss']
})
export class InvoicesHeaderComponent implements OnInit {
  @ViewChild('filter') filter: InvoicesFilterComponent;
  countFilter: number = 0;

  toggleFilter: boolean = true;
  @Output() onCreateInvoice = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
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
