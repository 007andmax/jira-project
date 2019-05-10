import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { QuoteService } from "../../../../../../../services/quote/quote.service";

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {

  @Input() client: any;

  public serviceListSubscription: Subscription;
  public client: any;

  constructor(
    private quoteService: QuoteService
  ) { }

  ngOnInit() {
  }

}
