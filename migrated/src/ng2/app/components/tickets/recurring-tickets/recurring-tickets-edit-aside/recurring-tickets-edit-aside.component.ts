import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { TicketStateService } from "../../ticket-state.service";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { ForCreateProduct } from '../class/for-create-product';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';
import { ForCreateService } from '../class/for-create-service';
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
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
import { Product } from 'src/ng2/app/interfaces/product/product';
import { EditProduct } from 'src/ng2/app/interfaces/product/edit-product';
import { $mol_time_moment as Moment } from 'mol_time_all'
import { Validate } from './class/validate';

@Component({
  selector: 'app-recurring-tickets-edit-aside',
  templateUrl: './recurring-tickets-edit-aside.component.html',
  styleUrls: ['./recurring-tickets-edit-aside.component.scss'],
  providers: [RecurringTicketsEditAsideService, RecurringTicketsService]
})
export class RecurringTicketsEditAsideComponent implements OnInit, OnDestroy {
  @ViewChild('date') date_dropDown: NgbDropdown;
  public showTicketRecurringSub: Subscription;
  public opened = false;
  // public showDatePicker: boolean = false;
  public ticketForm: FormGroup;
  public productList = [];
  public servicesList = [];
  public products: Array<ForCreateProduct> = [];
  public services: Array<ForCreateService> = [];
  public isFormValid = false;
  public type: string = "products";
  public datepicker: NgbDateStruct;
  public date: RecurringTicketsEditAsideDate = new RecurringTicketsEditAsideDate();
  // public ticket: RecurringTickets = new RecurringTickets();
  public navDate: any;
  public selectedClient: any;
  public devicesList = [];
  public tehUsers = [];
  public ticketForEdit: RecurringTicket = null;
  public validate: Validate = new Validate();
  // public errors = { products: { show: false, text: "" } };
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
    private recurringState: RecurringTicketsStateService,
    public createService: RecurringTicketsService,
  ) {
  }

  ngOnInit() {
    this.showTicketRecurring();
    this.getItemListProducts();
    this.recurringState.onInitClientList();
    this.onCheckEditMode();

    console.log('ticketForEdit', this.ticketForEdit);

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
    console.log('this.ticketForEdit', this.ticketForEdit);
    console.log('startDate', new Moment(data.startDate));
    this.companiesState.setCompanyFromtEdit(data.company);
    this.devicesService.onInitHangle(data.company.id);
    this.selectedClient = data.company;
    let date = new Date(data.startDate);
    this.navDate = this.createService.getNavDate(date);
    this.selectDateEditMode(this.createService.getDateForDatePicker(data.startDate));
    this.products = (data.products.length > 0) ? this.createService.getProductsForEdit(data.products) : [new ForCreateProduct()];
    this.services = (data.services.length > 0) ? this.createService.getServicesForEdit(data.services, data.serviceErrors) : [new ForCreateService()];
    console.log(' this.services', this.services);
    this.createService.setTagsForEdit(data.tags);
    this.createService.setCreateTask(data.createTask);
    this.createService.setRequireUpdate(data.requireUpdate);
    this.createService.setQuickClose(data.quickClose);
    this.createService.getTehState().setUsersFromtEdit(data.assignedUsers);
    this.createService.setCronForEdit(data.cronExpression);
    this.getListServices(data.company);
    // this.getItemListServices();

    this.cd.detectChanges();
  }

  public onChangeTags(tags) {
    this.recurringState.getCreateTicket().clearTags();
    tags.forEach((item) => {
      this.recurringState.getCreateTicket().addTag(item.id);
    })
  }

  public onChangeCron(data) {
    console.log('data', data)
    this.recurringState.getCreateTicket().setCronExpression(data);
  }

  public onChangeDescription(event) {
    this.recurringState.getCreateTicket().setDescription(event.target.value);
  }

  private onInitCreateMod() {

    this.products = [new ForCreateProduct()];
    this.services = [new ForCreateService()];
    this.recurringState.getCreateTicket().clearTehUsers();
    this.recurringState.getCreateTicket().clearTags();
    this.recurringState.getCreateTicket().clearAgents();
    this.recurringState.getCreateTicket().setDefaultCron();
    this.selectDate(this.createService.getDateForDatePicker(null));
    this.cd.detectChanges();
  }

  public onChangeTehUsers(tehusers) {
    this.tehUsers = tehusers;
    this.recurringState.getCreateTicket().clearTehUsers();
    this.tehUsers.forEach((item) => {
      this.recurringState.getCreateTicket().addAssignedUsers(item.id);
    })

  }

  private getCompanyDevices() {
    let company = this.recurringState.getClient();
    company && this.devicesService.onInitHangle(company.id);
  }

  public getItemListProducts() {
    this.productService.getCategories().subscribe((res: any) => {
      this.productList = res;
      console.log('this.productList', this.productList);
    });
  }

  public onCheckListServices() {
    const value = this.recurringState.getClient();
    value && this.getListServices(value);
  }

  private getListServices(value) {
    this.recurringService.getServiceList(value.id).subscribe((res: any) => {
      this.servicesList = res;
    })
  }

  public selectClient(selectClient) {

    if (selectClient === 'null') return;
    console.log('selectClient.item', selectClient.item);
    this.recurringState.getCreateTicket().setCompany(selectClient.item.id);
    this.ticketForm.controls['client'].setValue(selectClient);
    this.selectedClient = selectClient.item;
    this.recurringState.setClient(selectClient);
    this.onCheckListServices();

    this.getCompanyDevices();
    this.cd.detectChanges();

  }

  public selectDateEditMode(data: NgbDate) {
    this.datepicker = data;
    if (this.navDate) this.editService.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.date.setTitle(this.datepicker);
    this.createService.setTextInput('dropdownDate', this.date.getTitle());
  }

  public selectDate(data: NgbDate) {
    this.datepicker = data;
    if (this.navDate) this.editService.updateMonthAndYearDatePicker(this.datepicker, this.navDate);
    this.date.setTitle(this.datepicker);
    this.ticketForm.controls['date'].setValue(this.date.getTitle());
    this.createService.setTextInput('dropdownDate', this.date.getTitle());
    console.log('this.datepicker', this.datepicker);
    this.recurringState.getCreateTicket().setStartDate(this.datepicker.day, this.datepicker.month, this.datepicker.year, this.recurringState.getTehCompany().addresses[0].timeZone.timeOffset);
    this.date_dropDown.close();
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


  private updateDate() {
    this.date.setTitle(this.datepicker);
    this.ticketForm.controls['date'].setValue(this.date.getTitle());
    this.recurringState.getCreateTicket().setStartDate(this.datepicker.year, this.datepicker.month, this.datepicker.day, this.recurringState.getTehCompany().addresses[0].timeZone.timeOffset);
    this.createService.setTextInput('dropdownDate', this.date.getTitle());
    this.date_dropDown.close();
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


  public showTicketRecurring() {
    this.showTicketRecurringSub = this.ticketStateService.showTicketRecurringAside.subscribe((res) => {
      this.opened = true;
      this.initForm();
      this.onInitCreateMod();
    });
  }


  /**
   * set new item
   */
  public selectProduct(item, index) {
    console.log('item', item);
    item = { ...item, ...{ quantity: 1, discount: 1 } };
    /*  if (this.type === 'service') {
        item = {...item, ...{description: '', quantity: 1}};
      } else {
        item = {...item, ...{quantity: 1, markup: this.setMarkups(item)}};
      }*/
    this.products[index] = new ForCreateProduct(item);
    // this.products[index].discount = 1;
    // this.product.quantity = 1;
    //  this.selectedServiceItem.emit(item);

    //  this.type = undefined;
    //  this.changeType.next(this.type);
    //  this.quoteStateService.setType(true);

    this.cd.detectChanges();
  }

  public setService(item, index) {
    item = { ...item, ...{ description: '', duration: 1 } };
    /*  if (this.type === 'service') {
        item = {...item, ...{description: '', quantity: 1}};
      } else {
        item = {...item, ...{quantity: 1, markup: this.setMarkups(item)}};
      }*/
    this.services[index] = new ForCreateService(item);


    //  this.selectedServiceItem.emit(item);

    //  this.type = undefined;
    //  this.changeType.next(this.type);
    //  this.quoteStateService.setType(true);

  }

  public selectDevice(item) {
    this.recurringState.getCreateTicket().clearAgents();
    if (item) this.recurringState.getCreateTicket().setAgents(item.item.agentId);
  }

  public selectDuration(data, i) {
    console.log('data', data);
    /* if (data.minutes)
     {
       console.log('min', (data.minutes * 100) / 60);
     }*/
    this.services[i].duration = data.hour + ((data.minutes) ? (data.minutes / 60) : 0);
    console.log('this.services[i].duration', this.services[i].duration);
  }

  public addProduct() {
    let product: ForCreateProduct = new ForCreateProduct();
    this.products.push(product);
    this.cd.detectChanges();
  }

  public addService() {
    this.services.push(new ForCreateService());
  }

  public removeProduct(i) {
    this.products.splice(i, 1);
  }

  public removeService(i) {
    this.services.splice(i, 1);
  }

  public getNameOrDescription(item) {
    if (item && item.name) return item.name;
    if (item && item.description) return item.description;
    return '';
  }

  public onInitChackProduct() {
    this.recurringState.clearEditProducts();
    if (this.createService.checkProducts(this.products)) {
      this.productList.forEach((category, catIndex) => {
        category.products.forEach((prod, prodIndex) => {
          let index = this.products.findIndex(item => item.versionedId.id === prod.versionedId.id);
          if (index > (-1)) {
            console.log('catIndex', catIndex);
            console.log('prodIndex', prodIndex);
            if (this.products[index].manufacture !== prod.manufacture || Number(this.products[index].sale) !== prod.sale || Number(this.products[index].cost) !== prod.cost) {
              this.recurringState.addEditProduct(category, this.products[index]);

            }
          }
        })
      })
    }

    if (this.recurringState.getEditProducts().length > 0) {
      this.recurringService.onInitEditProducts(this.recurringState.getEditProducts()).subscribe(responseList => {
        console.log('responseList', responseList);
        responseList.forEach((item, index) => {
          this.products[index].versionedId.id = item.id;
          this.products[index].versionedId.version = item.version;
        })
        this.onInitSave();
        this.getItemListProducts();
      }, (err) => {
        console.log('this', this.products);
        console.log('err', err.error.validationResults);
        this.createService.checkErrorsProducts(this.products, err.error.validationResults);

        // this.errors.products.show = true;
        //  this.errors.products.text = (err.validationResults && err.validationResults.saleQuotePostDto) ? err.validationResults.saleQuotePostDto : err.message;
      });
    } else {
      this.onInitSave();
    }
  }

  public onInitSave() {

    this.recurringState.getCreateTicket().resetProducts();
    this.recurringState.getCreateTicket().resetServices();
    this.createService.setRulesCreateTicket(this.recurringState.getCreateTicket());

    if (this.createService.checkProductsForSave(this.ticketForEdit, this.products)) {
      console.log('change products');
      this.products.forEach((item: ForCreateProduct) => (item.name || item.description) && this.recurringState.getCreateTicket().addProdct(new CreateRecurringTicketsProduct(item.versionedId.id, item.quantity, item.discount)));

    } else {
      console.log('no change products');
      if (this.ticketForEdit === null) {
        this.recurringState.getCreateTicket().resetProducts();

      } else {
        this.recurringState.getCreateTicket().clearProducts();
      }

    }
    if (this.createService.checkServicesForSave(this.ticketForEdit, this.services)) {
      this.services.forEach((item: ForCreateService) => (item.name || item.description) && this.recurringState.getCreateTicket().addService(new CreateRecurringTicketsService(item.versionedId.id, item.description, item.duration)));

    } else {
      if (this.ticketForEdit === null) {
        this.recurringState.getCreateTicket().resetServices();

      } else {
        this.recurringState.getCreateTicket().clearServices();
      }
    }

    console.log('this.recurringState.getCreateTicket()', this.recurringState.getCreateTicket());

    if (this.ticketForEdit && this.ticketForEdit.id) {

      this.recurringService.editTicket(this.ticketForEdit, this.recurringState.getCreateTicket()).subscribe((res) => {
        console.log('res', res);
        this.close();
      })
    } else {

      this.recurringService.createTicket(this.recurringState.getCreateTicket()).subscribe((res) => {
        console.log('res', res);
        this.close();
      })
    }
  }

  public save() {
    if (this.ticketForEdit === null) {
      this.validate.checkValidatForCreate(this.recurringState.getCreateTicket());
      console.log('this.validate',this.validate);
      if (!this.validate.getCompany() || !this.validate.getInterval()) return;
    } else {

    }
    console.log('data', this.recurringState.getCreateTicket());
    console.log('this.products', this.products);
    this.onInitChackProduct();


  }

  public close() {
    this.opened = false;
    //this.showDatePicker = false;
    this.isFormValid = false;
    this.type = "products";
    this.selectedClient = null;
    this.devicesList = [];
    this.tehUsers = [];
    this.companiesState.onInitClear();
    this.createService.getDevicesState().onInitClear();
    this.date.clearTitle();
    this.createService.getTagsState().onInitClear();
    this.createService.getTehState().onInitClear();
    this.createService.clearData();
    this.navDate = null;
    this.createService.setDefaultDate();
    this.recurringState.clearCreateTicket();
    this.products = [];
    this.services = [];
    this.ticketForEdit = null;

  }

  public trackById(index, item) {
    return item.versionedId.id;
  }

  public trackByIndex(index, item) {
    return index;
  }

  ngOnDestroy(): void {
    this.createService.clearSubscriptions();
  }

}
