import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-invoice-tickets',
  templateUrl: './invoice-tickets.component.html',
  styleUrls: ['./invoice-tickets.component.scss']
})
export class InvoiceTicketsComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
  }

  ngOnDestroy() {
    $('body').removeClass('ng7');
  }
  
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
}
