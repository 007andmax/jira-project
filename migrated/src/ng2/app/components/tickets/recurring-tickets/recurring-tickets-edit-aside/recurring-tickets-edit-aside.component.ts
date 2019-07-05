import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from "rxjs";
import { TicketStateService } from "../../ticket-state.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { Product } from '../class/product';

@Component({
  selector: 'app-recurring-tickets-edit-aside',
  templateUrl: './recurring-tickets-edit-aside.component.html',
  styleUrls: ['./recurring-tickets-edit-aside.component.scss']
})
export class RecurringTicketsEditAsideComponent implements OnInit {

  public showTicketRecurringSub: Subscription;
  public opened = false;
  public navigation = 'arrows';
  public ticketForm: FormGroup;
  public product:Product;
  public productList = [];
  public isFormValid = false;
  public isDropDownShow = false;
  constructor(
    private ticketStateService: TicketStateService,
    private productService: ProductService,
    private fb: FormBuilder,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.showTicketRecurring();
   this.getItemListProducts();
   this.hideDropDown();
   this.ticketStateService.onInitClientList();
  }

  public selectClient(selectClient) {
    this.ticketForm.controls['client'].setValue(selectClient);
   // this.selectedClient = value.item;
    console.log('this.quoteForm',this.ticketForm);
    this.ticketStateService.setClient(selectClient);
    this.cd.detectChanges();
  }

  /**
   * get products list item
   */
  public getItemListProducts() {
    this.productService.getCategories().subscribe((res: any) => {
      return this.productList = res
    });
  /*  const value = this.quoteStateService.getClient();
    value && this.quoteService.getServiceList(value.id).subscribe((res: any) => {
      return this.servicesList = res
    });*/
  }
  public hideDropDown() {
    this.isDropDownShow = false;
  }

  public initForm() {
    
      this.ticketForm = this.fb.group({
        client: ['', Validators.required],
       /* startDate: this.dateService.getStartDate(new Date()),
        endDate: this.dateService.getStartDate(new Date().getTime() + this.fifteenDays),
        partialDeposit: '',
        purchaseOrder: '',
        quoteNumber: this.quoteNumber,
        po: '',
        regularNote: '',
        globalNote: ''*/
      })
     // this.onInitChengeForm();
    
  }

  public showTicketRecurring() {
    this.showTicketRecurringSub = this.ticketStateService.showTicketRecurringAside.subscribe((res) => {
      this.opened = true;
      this.initForm();
    });
  }

  public close() {
    this.opened = false;
  }

  public toggleShowDropDown() {
    this.isDropDownShow = !this.isDropDownShow;
  }

  /**
   * set new item
   */
  public setItem(item) {
    console.log('item',item);
  /*  if (this.type === 'service') {
      item = {...item, ...{description: '', quantity: 1}};
    } else {
      item = {...item, ...{quantity: 1, markup: this.setMarkups(item)}};
    }*/
    this.product = item;
  //  this.selectedServiceItem.emit(item);
    this.isDropDownShow = false;
  //  this.type = undefined;
  //  this.changeType.next(this.type);
  //  this.quoteStateService.setType(true);
  }
public getProductNameOrDescription () {
  if (this.product && this.product.name) return this.product.name;
  if (this.product && this.product.description) return this.product.description;
  return '';
}

  

}
