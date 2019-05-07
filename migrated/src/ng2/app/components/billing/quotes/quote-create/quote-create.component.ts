import { Component, OnInit, ViewChild } from '@angular/core';
import { QuoteCreateContentComponent } from "./quote-create-content/quote-create-content.component";

@Component({
  selector: 'app-quote-create',
  templateUrl: './quote-create.component.html',
  styleUrls: ['./quote-create.component.scss']
})
export class QuoteCreateComponent implements OnInit {

  @ViewChild(QuoteCreateContentComponent) quoteCreateContentComponent:QuoteCreateContentComponent;

  constructor() { }

  ngOnInit() {
  }

  public saveAndContinue() {
    this.quoteCreateContentComponent.saveAndContinue();

  }

}
