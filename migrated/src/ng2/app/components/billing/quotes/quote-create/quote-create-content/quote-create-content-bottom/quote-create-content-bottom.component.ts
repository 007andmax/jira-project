import { Component, Input, OnInit } from '@angular/core';

import { ProductService } from "../../../../../../services/product/product.service";
import {QuoteService} from "../../../../../../services/quote/quote.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-quote-create-content-bottom',
  templateUrl: './quote-create-content-bottom.component.html',
  styleUrls: ['./quote-create-content-bottom.component.scss']
})
export class QuoteCreateContentBottomComponent implements OnInit {

  @Input() set clientId(value: any) {
    this.client = value;
    console.log(value, 'value');
    value && this.getServices(value);
  }

  public serviceList: any;
  public client: any;

  public productItemEmpty = {
    type: 'empty',
    cost: '',
    description: '',
    glNumber: '',
    ilc: '',
    manufacture: '',
    sale: '',
    versionedId: {
      id: '',
      version: ''
    }
  };
  public serviceItemEmpty = {
    type: 'empty',
    cost: '',
    description: '',
    glNumber: '',
    ilc: '',
    manufacture: '',
    sale: '',
    versionedId: {
      id: '',
      version: ''
    }
  };
  public serviceListSubscription: Subscription;
  public productItemsArray = [];
  public serviceItemsArray = [];
  public showProductsCategory = false;

  constructor(
    private quoteService: QuoteService
  ) { }

  ngOnInit() {}

  public addProduct() {
    this.serviceItemsArray.shift();
    this.productItemsArray.unshift(this.productItemEmpty);
  }

  public addService() {
    this.productItemsArray.shift();
    this.serviceItemsArray.unshift(this.serviceItemEmpty);
  }

  getServices(value) {
    this.serviceListSubscription = this.quoteService.getServiceList(value.id).subscribe((res)=> {
        this.serviceList = res;
        console.log(res, 'RES');
    })
  }

  public ngOnDestroy(): void {
    this.serviceListSubscription.unsubscribe();
  }

}
