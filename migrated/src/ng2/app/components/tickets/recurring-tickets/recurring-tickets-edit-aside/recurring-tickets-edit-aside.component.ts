import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { TicketStateService } from "../../ticket-state.service";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { Product } from '../class/product';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';
import { Service } from '../class/service';
import { NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { RecurringTicketsEditAsideService } from './services/recurring-tickets-edit-aside.service';
import { RecurringTickets } from '../class/recurring-tickets';
import { RecurringTicketsEditAsideDate } from './class/recurring-tickets-edit-aside-date';
import { NgbDatepickerNavigateEvent, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';

@Component({
  selector: 'app-recurring-tickets-edit-aside',
  templateUrl: './recurring-tickets-edit-aside.component.html',
  styleUrls: ['./recurring-tickets-edit-aside.component.scss'],
  providers: [RecurringTicketsEditAsideService]
})
export class RecurringTicketsEditAsideComponent implements OnInit {

  public showTicketRecurringSub: Subscription;
  public opened = false;
  public showDatePicker: boolean = false;
  public navigation = 'arrows';
  public ticketForm: FormGroup;
  public productList = [];
  public servicesList = [];
  public products: Array<Product> = [new Product()];
  public services: Array<Service> = [new Service()];
  public isFormValid = false;
  public type: string = "products";
  public datepicker: NgbDateStruct;
  public date: RecurringTicketsEditAsideDate = new RecurringTicketsEditAsideDate();
  public ticket: RecurringTickets = new RecurringTickets();
  public navDate: any;
  public selectedClient: any;
  public devicesList = [];
  public tehUsers = [];
  constructor(
    private ticketStateService: TicketStateService,
    private productService: ProductService,
    private recurringService: RecurringService,
    private fb: FormBuilder,
    public cd: ChangeDetectorRef,
    private editService: RecurringTicketsEditAsideService,
    private calendar: NgbCalendar,
    private devicesService: DevicesService,
  ) { }

  ngOnInit() {
    this.showTicketRecurring();
    this.getItemListProducts();
    this.ticketStateService.onInitClientList();
    this.cd.detectChanges();
  }

  public selectClient(selectClient) {
    this.ticketForm.controls['client'].setValue(selectClient);
    this.selectedClient = selectClient.item;
    this.ticketStateService.setClient(selectClient);
    this.getItemListServices();

    this.getCompanyDevices();
    this.cd.detectChanges();

  }

  public onChangeCron(data) {
    console.log('data', data);
  }

  private getCompanyDevices() {
    let company = this.ticketStateService.getClient();
    this.devicesService.onInitHangle(company.id);
  }

  /**
   * get products list item
   */
  public getItemListProducts() {
    this.productService.getCategories().subscribe((res: any) => {
      this.productList = res;

    });

  }
  public selectDate(data: NgbDate) {
    this.datepicker = data;
    if (this.navDate) this.editService.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.date.setTitle(this.datepicker);
    this.ticketForm.controls['date'].setValue(this.date.getTitle());
    this.hideDatePicker();
    this.cd.detectChanges();
  }

  public selectTomorrow() {
    let date = this.calendar.getToday();

    date.day++;
    this.datepicker = date;
    if (this.navDate) this.editService.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.updateDate();
  }
  public selectToday() {
    this.datepicker = this.calendar.getToday();
    if (this.navDate) this.editService.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.updateDate();
  }
  public selectEndMonth() {
    let date = this.calendar.getToday();
    let day = 32 - new Date(date.year, date.month - 1, 32).getDate();
    date.day = day;
    this.datepicker = date;
    if (this.navDate) this.editService.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.updateDate();
  }
  public selectStartMonth() {
    let date = this.calendar.getToday();
    date.day = 1;
    this.datepicker = date;
    if (this.navDate) this.editService.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.updateDate();
  }
  public getItemListServices() {
    const value = this.ticketStateService.getClient();
    console.log('value', value);
    this.recurringService.getServiceList(value.id).subscribe((res: any) => {
      console.log('res', res);
      console.log('this.servicesList', this.servicesList);
      this.servicesList = res;
    })
  }

  private updateDate() {
    this.date.setTitle(this.datepicker);
    this.ticketForm.controls['date'].setValue(this.date.getTitle());
    this.hideDatePicker();
  }
  public navigateDate(data: NgbDatepickerNavigateEvent) {
    this.navDate = data;
  }

  public initForm() {

    this.ticketForm = this.fb.group({
      client: ['', Validators.required],
      date: ['', Validators.required],
      serial: new FormControl(''),
      cost: new FormControl(''),
      quantity: new FormControl(''),
      price: new FormControl(''),
      discount: new FormControl(''),
      description: new FormControl('')
    })
    // this.onInitChengeForm();

  }

  /**
  * Hide datepicker
  */
  public hideDatePicker() {
    this.showDatePicker = false;
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


  /**
   * set new item
   */
  public selectProduct(item, index) {
    console.log('item', item);
    item = { ...item, ...{ quantity: 1 } };
    /*  if (this.type === 'service') {
        item = {...item, ...{description: '', quantity: 1}};
      } else {
        item = {...item, ...{quantity: 1, markup: this.setMarkups(item)}};
      }*/
    this.products[index] = item;
    // this.product.quantity = 1;
    //  this.selectedServiceItem.emit(item);
    this.products[index].isDropDownShowProducts = false;

    //  this.type = undefined;
    //  this.changeType.next(this.type);
    //  this.quoteStateService.setType(true);
    this.cd.detectChanges();
  }
  public setService(item, index) {

    /*  if (this.type === 'service') {
        item = {...item, ...{description: '', quantity: 1}};
      } else {
        item = {...item, ...{quantity: 1, markup: this.setMarkups(item)}};
      }*/
    this.services[index] = item;
    this.services[index].description = '';


    //  this.selectedServiceItem.emit(item);
    this.services[index].isDropDownShowServices = false;
    //  this.type = undefined;
    //  this.changeType.next(this.type);
    //  this.quoteStateService.setType(true);

  }
  public getNameOrDescription(item) {
    if (item && item.name) return item.name;
    if (item && item.description) return item.description;
    return '';
  }

  /**
     * toggle date picker
     */
  public toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }


  public selectDevice(item) {

  }
  public onChangeTags(data) {
    console.log('data', data);
  }
  public selectDuration(data) {
    console.log('data', data);
  }

  public addProduct() {
    let product: Product = new Product();
    this.products.push(product);
    console.log(' this.products', this.products);
    this.cd.detectChanges();
  }
  public addService() {
    this.services.push(new Service());
  }
  public trackById(index, item) {
    return item.versionedId.id;
  }

  public trackByIndex(index, item) {
    return index;
  }
  public removeProduct(i) {
    this.products.splice(i, 1);
  }
  public removeService(i) {
    this.services.splice(i, 1);
  }
  public onChangeTehUsers(tehusers) {
    this.tehUsers = tehusers;
   
  }



}
