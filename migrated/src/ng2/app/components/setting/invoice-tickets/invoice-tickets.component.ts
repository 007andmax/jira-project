import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-tickets',
  templateUrl: './invoice-tickets.component.html',
  styleUrls: ['./invoice-tickets.component.scss'],
})
export class InvoiceTicketsComponent implements OnInit {
  log = 14;
  increaseValue() {
    this.log = this.log + 1;
  }
  decreaseValue() {
    if (this.log > 0) {
      this.log--;
    }
  }

  constructor() {}

  ngOnInit() {}
}
