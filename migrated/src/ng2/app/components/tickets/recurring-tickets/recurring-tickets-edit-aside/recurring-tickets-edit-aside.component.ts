import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from "rxjs";
import { TicketStateService } from "../../ticket-state.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { Product } from '../class/product';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';
import { Service } from '../class/service';

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
  public service:Service;
  public productList = [];
  public servicesList = [];
  public isFormValid = false;
  public isDropDownShowProducts = false;
  public isDropDownShowServices = false;
  public type:string = "products";
  constructor(
    private ticketStateService: TicketStateService,
    private productService: ProductService,
    private recurringService:RecurringService,
    private fb: FormBuilder,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.showTicketRecurring();
   this.getItemListProducts();
   this.hideDropDownProducts();
   this.hideDropDownServices();
   this.ticketStateService.onInitClientList();
  }

  public selectClient(selectClient) {
    this.ticketForm.controls['client'].setValue(selectClient);
   // this.selectedClient = value.item;
    console.log('this.quoteForm',this.ticketForm);
    this.ticketStateService.setClient(selectClient);
    
    this.getItemListServices();
    this.cd.detectChanges();
  }

  /**
   * get products list item
   */
  public getItemListProducts() {
    this.productService.getCategories().subscribe((res: any) => {
      return this.productList = res
    });
    
  }
  public getItemListServices () {
    const value = this.ticketStateService.getClient();
    console.log('value',value);
     this.recurringService.getServiceList(value.id).subscribe((res:any) => {
      console.log('res',res);
      console.log('this.servicesList',this.servicesList);
      return this.servicesList = res
    })
  }
  public hideDropDownProducts() {
    this.isDropDownShowProducts = false;
  }

  public hideDropDownServices() {
    this.isDropDownShowServices = false;
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

  public toggleShowDropDownProducts() {
    this.isDropDownShowProducts = !this.isDropDownShowProducts;
  }

  public toggleShowDropDownServices() {
    this.isDropDownShowServices = !this.isDropDownShowServices;
  }
  /**
   * set new item
   */
  public setProductItem(item) {
    console.log('item',item);
  /*  if (this.type === 'service') {
      item = {...item, ...{description: '', quantity: 1}};
    } else {
      item = {...item, ...{quantity: 1, markup: this.setMarkups(item)}};
    }*/
    this.product = item;
  //  this.selectedServiceItem.emit(item);
    this.isDropDownShowProducts = false;
  //  this.type = undefined;
  //  this.changeType.next(this.type);
  //  this.quoteStateService.setType(true);
  }
  public setServiceItem (item) {
    console.log('item',item);
  /*  if (this.type === 'service') {
      item = {...item, ...{description: '', quantity: 1}};
    } else {
      item = {...item, ...{quantity: 1, markup: this.setMarkups(item)}};
    }*/
    this.service = item;
  //  this.selectedServiceItem.emit(item);
    this.isDropDownShowServices = false;
  //  this.type = undefined;
  //  this.changeType.next(this.type);
  //  this.quoteStateService.setType(true);
    
  }
public getNameOrDescription (item) {
  if (item && item.name) return item.name;
  if (item && item.description) return item.description;
  return '';
}

  

}
