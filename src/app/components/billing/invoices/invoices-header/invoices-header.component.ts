import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppService } from 'src/app/states/app/app.service';
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

  toggleFilter: boolean = false;
  @Output() onCreateInvoice = new EventEmitter<any>();
  @Output() onSortBy = new EventEmitter<any>();
  constructor(public appService: AppService,) { }

  ngOnInit() {
    if (this.appService.checkMobile()) this.toggleFilter = true;
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
