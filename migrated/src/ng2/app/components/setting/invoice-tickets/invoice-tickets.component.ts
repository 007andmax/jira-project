import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-tickets',
  templateUrl: './invoice-tickets.component.html',
  styleUrls: ['./invoice-tickets.component.scss']
})
export class InvoiceTicketsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
}
