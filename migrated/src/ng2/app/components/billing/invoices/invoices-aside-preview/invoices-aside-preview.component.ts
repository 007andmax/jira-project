import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-invoices-aside-preview',
  templateUrl: './invoices-aside-preview.component.html',
  styleUrls: ['./invoices-aside-preview.component.scss']
})
export class InvoicesAsidePreviewComponent implements OnInit {
  @Output() onClose = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  close() {
    this.onClose.emit(null);
  }
}
