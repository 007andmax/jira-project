import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-invoices-aside',
  templateUrl: './invoices-aside.component.html',
  styleUrls: ['./invoices-aside.component.scss']
})
export class InvoicesAsideComponent implements OnInit {
  @Output() onClose = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  close() {
    this.onClose.emit(null);
  }
}
