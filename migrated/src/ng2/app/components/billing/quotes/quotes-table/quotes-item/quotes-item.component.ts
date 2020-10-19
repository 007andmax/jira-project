import { Component, Input, OnInit } from '@angular/core';
import { Quote } from '../../class/quote';
import * as moment from "moment";

@Component({
  selector: 'app-quotes-item',
  templateUrl: './quotes-item.component.html',
  styleUrls: ['./quotes-item.component.scss']
})
export class QuotesItemComponent implements OnInit {
  @Input() quote:Quote;
  constructor() { }

  ngOnInit() {
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
}
