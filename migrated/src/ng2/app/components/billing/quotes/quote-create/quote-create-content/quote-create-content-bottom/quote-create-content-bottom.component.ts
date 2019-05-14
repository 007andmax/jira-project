import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {QuoteStateService} from "../../quote-state.service";
import {QuoteService} from "../../../../../../services/quote/quote.service";

@Component({
  selector: 'app-quote-create-content-bottom',
  templateUrl: './quote-create-content-bottom.component.html',
  styleUrls: ['./quote-create-content-bottom.component.scss']
})
export class QuoteCreateContentBottomComponent implements OnInit {

  @Input() set clientId(value: any) {
    this.client = value;
    this.quoteStateServices.setClient(value);
    this.type = undefined;
    this.itemsArray = [];
  }

  public serviceList: any;
  public client: any;
  public type: string;
  public itemsArray = [];
  public productsArray = [];
  public servicesArray = [];
  public subTotalServices = 0;
  public subTotalProducts = 0;
  public totalTaxes = 0;
  public total = 0;


  constructor(
    private quoteStateServices: QuoteStateService,
    private quoteServices: QuoteService,

  ) { }

  ngOnInit() {}

  public addProduct() {
    this.type = 'product';
  }

  public addService() {
    this.type = 'service';
  }

  public addItemToItemsArray(item) {
    this.itemsArray.push(item);
    this.calculateArrays();
  }

  public divideArray() {
    this.productsArray = this.quoteServices.getProductItems(this.itemsArray, 'product');
    this.servicesArray = this.quoteServices.getProductItems(this.itemsArray, 'service');
  }

  public calculateArrays() {
    this.refreshTotals();
    this.divideArray();
    this.resolveTotal();
    this.resolveTaxes();
  }

  public refreshTotals() {
    this.subTotalServices = 0;
    this.subTotalProducts = 0;
    this.totalTaxes = 0;
    this.total = 0;
  }

  public resolveTotal() {
    this.productsArray.map((item) => {
      const product = item.item;
      this.subTotalProducts += product.sale * product.quantity
    });
    this.servicesArray.map((item) => {
      const service = item.item;
      this.subTotalServices += service.rate * service.quantity
    });
    this.total = this.getTotal();
  }

  public resolveTaxes() {
    this.itemsArray.map((item) => {
      console.log(item);
      const taxes = item && item.taxes[0];
      const product = item;
      console.log(taxes, 'TAXES');
      if (taxes) {
        console.log(1);
        this.totalTaxes += (((taxes.rate)/100) * (product.rate || product.sale)) * product.quantity
      }
    });
  }

  public getTotal() {
    return this.totalTaxes + this.subTotalServices + this.subTotalProducts
  }

  public changeType(type) {
    this.type = type;
  }

  public refreshItemsArray(value) {
    console.log(value);
    this.itemsArray = value;
    this.calculateArrays();
  }

}
