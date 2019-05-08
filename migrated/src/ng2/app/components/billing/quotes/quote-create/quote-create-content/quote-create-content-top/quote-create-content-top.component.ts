import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-quote-create-content-top',
  templateUrl: './quote-create-content-top.component.html',
  styleUrls: ['./quote-create-content-top.component.scss']
})
export class QuoteCreateContentTopComponent implements OnInit {

  @Output() selectedItem = new EventEmitter<any>();
  @Input() quoteForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

  public selectClient(selectClient) {
    this.selectedItem.next(selectClient);
  }

}
