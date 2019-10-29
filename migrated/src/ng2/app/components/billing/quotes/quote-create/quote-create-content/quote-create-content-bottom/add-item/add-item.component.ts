import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { QuoteStateService } from "../../../quote-state.service";
import { QuoteService } from "../../../../../../../services/quote/quote.service";
import { ProductService } from "../../../../../../../services/product/product.service";

/**
 * Add item component
 */
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

  @Input() set setType(value) {
    this.type = value;
    value && this.quoteStateService.setType(false);
    this.getServicesList();
    this.hideDropDown();
  };
  public isDropDownShow = false;
  public type: string;
  public itemListProducts: any;
  public itemListServices: any;
  public isFormValid = false;
  @Output() selectedServiceItem = new EventEmitter<any>();
  @Output() changeType = new EventEmitter<any>();

  /**
   * Creates an instance of the AddItemComponent with the injected services
   * @param {QuoteStateService} quoteStateService Service to work quote state
   * @param {QuoteService} quoteService Service to work with api
   * @param {ProductService} productService Service
   */
  constructor(
    private quoteStateService: QuoteStateService,
    private quoteService: QuoteService,
    private productService: ProductService
  ) { }

  /**
   * Initializes product list. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.subToFormValidation();
  }

  /**
   * toggle dropdown
   */
  public toggleShowDropDown() {
    this.isDropDownShow = !this.isDropDownShow;
  }

  /**
   * hide dropdown
   */
  public hideDropDown() {
    this.isDropDownShow = false;
  }

  /**
   * get services list
   */
  public getServicesList() {
    this.productService.getCategories().subscribe((res) => {
      
     return this.itemListProducts = res
    });
    const value = this.quoteStateService.getClient();
    value && this.quoteService.getServiceList(value.id).subscribe((res) => {
      return this.itemListServices = res
    })
  }

  /**
   * set new item
   */
  public setItem(item) {
   
    if (this.type === 'service') {
      item = {...item, ...{description: '', quantity: 1}};
    } else {
      item = {...item, ...{quantity: 1, markup: this.setMarkups(item)}};
    }
    
    this.selectedServiceItem.emit(item);
    this.isDropDownShow = false;
    this.type = undefined;
    this.changeType.next(this.type);
    this.quoteStateService.setType(true);
  }

  /**
   * hide add form
   */
  public hideAddForm() {
    this.isDropDownShow = false;
    this.type = undefined;
    this.isFormValid = false;
    this.quoteStateService.setType(false);
    this.changeType.next(undefined);
  }

  /**
   * subscribe to form validation
   */
  public subToFormValidation() {
    this.quoteStateService.validateForm.subscribe((res) => {
      this.isFormValid = !res;
    })
  }

  /**
   * set murkups
   */
  public setMarkups(item) {
    if (item.sale > 0 && item.cost > 0 )  return Math.round((item.sale - item.cost)/item.cost* 100);
    return 0;
     
  }

}
