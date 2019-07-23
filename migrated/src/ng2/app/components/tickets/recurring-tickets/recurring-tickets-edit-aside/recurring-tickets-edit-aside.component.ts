import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { TicketStateService } from "../../ticket-state.service";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { ForCreateProduct } from '../class/for-create-product';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';
import { ForCreateService } from '../class/for-create-service';
import { NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { RecurringTicketsEditAsideService } from './services/recurring-tickets-edit-aside.service';

import { RecurringTicketsEditAsideDate } from './class/recurring-tickets-edit-aside-date';
import { NgbDatepickerNavigateEvent, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { SelectClientCompanyStateService } from '../../../billing/quotes/quote-create/quote-create-content/quote-create-content-top/select-client-company/services/select-client-company-state.service';
import { DevicesStateService } from '../devices-recurring-tickets/services/devices-state.service';
import { TagsStateService } from '../../../shared/tags/services/tags-state.service';
import { TehUsersSateService } from '../../../shared/teh-users/services/teh-users-sate.service';
import { RecurringTicketsStateService } from '../services/recurring-tickets-state.service';
import { CreateRecurringTicketsProduct } from './class/create-recurring-tickets-product';
import { CreateRecurringTicketsService } from './class/create-recurring-tickets-service';
import { RecurringTicketsService } from './services/recurring-tickets.service';
import { RecurringTicket } from '../class/recurring-ticket';
import { RecurringTicketCompany } from '../interfaces/recurring-ticket-company';
import { IntervalStateService } from '../../../shared/interval/services/interval-state.service';

@Component({
  selector: 'app-recurring-tickets-edit-aside',
  templateUrl: './recurring-tickets-edit-aside.component.html',
  styleUrls: ['./recurring-tickets-edit-aside.component.scss'],
  providers: [RecurringTicketsEditAsideService, RecurringTicketsService]
})
export class RecurringTicketsEditAsideComponent implements OnInit, OnDestroy {


  public showTicketRecurringSub: Subscription;
  public opened = false;
  public showDatePicker: boolean = false;
  public navigation = 'arrows';
  public ticketForm: FormGroup;
  public productList = [];
  public servicesList = [];
  public products: Array<ForCreateProduct> = [new ForCreateProduct()];
  public services: Array<ForCreateService> = [new ForCreateService()];
  public isFormValid = false;
  public type: string = "products";
  public datepicker: NgbDateStruct;
  public date: RecurringTicketsEditAsideDate = new RecurringTicketsEditAsideDate();
  // public ticket: RecurringTickets = new RecurringTickets();
  public navDate: any;
  public selectedClient: any;
  public devicesList = [];
  public tehUsers = [];
  public ticketForEdit: RecurringTicket = new RecurringTicket();
  constructor(
    private ticketStateService: TicketStateService,
    private productService: ProductService,
    private recurringService: RecurringService,
    private fb: FormBuilder,
    public cd: ChangeDetectorRef,
    private editService: RecurringTicketsEditAsideService,
    private calendar: NgbCalendar,
    private devicesService: DevicesService,
    private companiesState: SelectClientCompanyStateService,
    private devicesState: DevicesStateService,
    private tagsState: TagsStateService,
    private tehState: TehUsersSateService,
    private recurringState: RecurringTicketsStateService,
    public createService: RecurringTicketsService,
   

  ) { }

  ngOnInit() {
    this.showTicketRecurring();
    this.getItemListProducts();
    this.recurringState.onInitClientList();
    this.onCheckEditMode();

  }
  private onCheckEditMode() {
    let editmode = this.recurringState.getEditMode().subscribe((data: RecurringTicket) => {
      this.opened = true;
      this.initForm();
      this.onEditEditMode(data);
    })
    this.createService.addSubscription(editmode);
  }
  private onEditEditMode(data: RecurringTicket) {
    this.createService.setDescription(data.description);
    this.ticketForEdit = data;
    this.companiesState.setCompanyFromtEdit(data.company);
    this.devicesService.onInitHangle(data.company.id);
    this.selectedClient = data.company;
    let date = new Date(data.startDate);
    this.navDate = this.createService.getNavDate(date);
    let ngbDate: NgbDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDay());
    this.selectDate(ngbDate);
    this.products = this.createService.getProductsForEdit(data.products);
    this.services = this.createService.getServicesForEdit(data.services);
    this.createService.setTagsForEdit(data.tags);
    this.createService.setCreateTask(data.createTask);
    this.createService.setRequireUpdate(data.requireUpdate);
    this.createService.setQuickClose(data.quickClose);
    this.tehState.setUsersFromtEdit(data.assignedUsers);
    // this.cd.detectChanges();
  }
  public selectClient(selectClient) {
    if (selectClient === 'null') return;
    this.recurringState.getCreateTicket().setCompany(selectClient.item.id);
    this.ticketForm.controls['client'].setValue(selectClient);
    this.selectedClient = selectClient.item;
    this.recurringState.setClient(selectClient);
    this.getItemListServices();

    this.getCompanyDevices();
    this.cd.detectChanges();

  }

  public onChangeCron(data) {
    console.log('data', data);
    this.recurringState.getCreateTicket().setCronExpression(data);
  }

  private getCompanyDevices() {
    let company = this.recurringState.getClient();
    company && this.devicesService.onInitHangle(company.id);
  }

  /**
   * get products list item
   */
  public getItemListProducts() {
    this.productService.getCategories().subscribe((res: any) => {
      this.productList = res;
    });
  }

  public onChangeDescription(event) {
    this.recurringState.getCreateTicket().setDescription(event.target.value);
  }
  public selectDate(data: NgbDate) {
    this.datepicker = data;
    if (this.navDate) this.editService.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.date.setTitle(this.datepicker);
    this.ticketForm.controls['date'].setValue(this.date.getTitle());
    this.hideDatePicker();
    this.cd.detectChanges();
    this.recurringState.getCreateTicket().setStartDate(this.datepicker.day, this.datepicker.month, this.datepicker.year);
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
    const value = this.recurringState.getClient();
    value && this.recurringService.getServiceList(value.id).subscribe((res: any) => {
      this.servicesList = res;
    })
  }

  private updateDate() {
    this.date.setTitle(this.datepicker);
    this.ticketForm.controls['date'].setValue(this.date.getTitle());
    this.hideDatePicker();
    this.recurringState.getCreateTicket().setStartDate(this.datepicker.year, this.datepicker.month, this.datepicker.day);
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
    this.showDatePicker = false;
    this.products = [new ForCreateProduct()];
    this.services = [new ForCreateService()];
    this.isFormValid = false;
    this.type = "products";
    this.selectedClient = null;
    this.devicesList = [];
    this.tehUsers = [];
    this.companiesState.onInitClear();
    this.devicesState.onInitClear();
    this.date.clearTitle();
    this.tagsState.onInitClear();
    this.tehState.onInitClear();
    this.createService.clearData();
    this.navDate = null;
    this.datepicker = this.calendar.getToday();
 this.createService.setDefaultDate();
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
    this.products[index].discount = 1;
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
    this.services[index].duration = 1;

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
    this.recurringState.getCreateTicket().clearAgents();
    if (item) this.recurringState.getCreateTicket().setAgents(item.item.agentId);
  }
  public onChangeTags(tags) {

    this.recurringState.getCreateTicket().clearTags();
    tags.forEach((item) => {
      this.recurringState.getCreateTicket().addTag(item.id);
    })
  }
  public selectDuration(data) {
    console.log('data', data);
  }

  public addProduct() {
    let product: ForCreateProduct = new ForCreateProduct();
    this.products.push(product);
    this.cd.detectChanges();
  }
  public addService() {
    this.services.push(new ForCreateService());
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
    this.recurringState.getCreateTicket().clearTehUsers();
    this.tehUsers.forEach((item) => {
      this.recurringState.getCreateTicket().addAssignedUsers(item.id);
    })

  }

  public save() {
    this.recurringState.getCreateTicket().clearProducts();
    this.recurringState.getCreateTicket().clearServices();
    this.createService.setRulesCreateTicket(this.recurringState.getCreateTicket());
    this.products.forEach((item: ForCreateProduct) => (item.name || item.description) && this.recurringState.getCreateTicket().addProdct(new CreateRecurringTicketsProduct(item.versionedId.id, item.quantity, item.discount)));
    this.services.forEach((item: ForCreateService) => (item.name || item.description) && this.recurringState.getCreateTicket().addService(new CreateRecurringTicketsService(item.versionedId.id, item.description, item.duration)));
    console.log('data', this.recurringState.getCreateTicket());

    this.recurringService.createTicket(this.recurringState.getCreateTicket()).subscribe((res) => {
      console.log('res', res);
      this.close();
    })
  }

  ngOnDestroy(): void {
    this.createService.clearSubscriptions();
  }
}
