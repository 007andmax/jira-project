import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-quote-create-header',
  templateUrl: './quote-create-header.component.html',
  styleUrls: ['./quote-create-header.component.scss']
})
export class QuoteCreateHeaderComponent implements OnInit {

  @Output() saveAndContinue = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  public saveQuotes() {
    this.saveAndContinue.next();
  }

}
