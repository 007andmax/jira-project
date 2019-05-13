import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import { QuoteStateService } from "../../../quote-state.service";
import { QuoteService } from "../../../../../../../services/quote/quote.service";
import {ProductService} from "../../../../../../../services/product/product.service";


@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {

  @Input() set setType(value) {
    this.type = value;
    this.getServicesList();
  };
  public isDropDownShow = false;
  public type: string;
  public itemList$: any;
  @Output() selectedServiceItem = new EventEmitter<any>();

  constructor(
    private quoteStateService: QuoteStateService,
    private quoteService: QuoteService,
    private productService: ProductService
  ) { }

  ngOnInit() {
  }

  public toggleShowDropDown() {
    this.isDropDownShow = !this.isDropDownShow;
  }

  public getServicesList() {
    if (this.type === 'product') {
      this.itemList$ = this.productService.getCategories();
    } else if (this.type === 'service') {
      const value = this.quoteStateService.getClient();
      value && (this.itemList$ = this.quoteService.getServiceList(value.item.id))
    }
  }

  public setItem(item) {
    if (this.type === 'service') {
      item = {...item, ...{description: '', quantity: 1}};
    } else {
      item = {...item, ...{quantity: 1}};
    }
    this.selectedServiceItem.emit(item);
    this.isDropDownShow = false;
  }

  public getPrice(cost, count) {
    return this.quoteStateService.getPrice(cost, count);
  }

}
