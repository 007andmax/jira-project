import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup } from "@angular/forms";

/**
 *  Quotes create content top component
 */
@Component({
  selector: 'app-quote-create-content-top',
  templateUrl: './quote-create-content-top.component.html',
  styleUrls: ['./quote-create-content-top.component.scss']
})
export class QuoteCreateContentTopComponent {

  @Output() selectedItem = new EventEmitter<any>();
  @Input() quoteForm: FormGroup;

  constructor() { }

  /**
   * Emit selected client to parent
   * @params selected Client
   */
  public selectClient(selectClient) {
    this.selectedItem.next(selectClient);
  }

}
