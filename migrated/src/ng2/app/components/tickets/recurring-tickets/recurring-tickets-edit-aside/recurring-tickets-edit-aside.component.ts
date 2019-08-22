import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";

import {  FormBuilder } from '@angular/forms';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { ForCreateProduct } from '../class/for-create-product';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';
import { ForCreateService } from '../class/for-create-service';
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

import { RecurringTicketsEditAsideDate } from './class/recurring-tickets-edit-aside-date';
import { NgbDatepickerNavigateEvent, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { SelectClientCompanyStateService } from '../../../billing/quotes/quote-create/quote-create-content/quote-create-content-top/select-client-company/services/select-client-company-state.service';
import { RecurringTicketsStateService } from '../services/recurring-tickets-state.service';
import { CreateRecurringTicketsProduct } from './class/create-recurring-tickets-product';
import { CreateRecurringTicketsService } from './class/create-recurring-tickets-service';
import { RecurringTicketsService } from './services/recurring-tickets.service';
import { RecurringTicket } from '../class/recurring-ticket';
import { $mol_time_moment as Moment } from 'mol_time_all'
import { Validate } from './class/validate';
import { ChangeDatePicker } from '../../../shared/date-picker/class/change-date-picker';

@Component({
  selector: 'app-recurring-tickets-edit-aside',
  templateUrl: './recurring-tickets-edit-aside.component.html',
  styleUrls: ['./recurring-tickets-edit-aside.component.scss'],
  providers: [RecurringTicketsService]
})
export class RecurringTicketsEditAsideComponent implements OnInit, OnDestroy {
 
  public showTicketRecurringSub: Subscription;
  public opened = false;

  public productList = [];
  public servicesList = [];
  public products: Array<ForCreateProduct> = [];
  public services: Array<ForCreateService> = [];
  public type: string = "products";
  public selectedClient: any;
  public devicesList = [];
  public tehUsers = [];
  public ticketForEdit: RecurringTicket = null;
  public validate: Validate = new Validate();
 
  constructor(
  
    private productService: ProductService,
    private recurringService: RecurringService,
    public cd: ChangeDetectorRef,
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
   
  }
  public onChangeDatePicker (data: ChangeDatePicker) {
  console.log('data',data);
      this.recurringState.getCreateTicket().setStartDate(data.day, data.month, data.year, this.recurringState.getTehCompany().addresses[0].timeZone.timeOffset);
  
  }

  private onCheckEditMode() {
    let editmode = this.recurringState.getEditMode().subscribe((data: RecurringTicket) => {
      this.opened = true;
      
      this.onEditEditMode(data);
    })
    this.createService.addSubscription(editmode);
  }

  private onEditEditMode(data: RecurringTicket) {
    this.createService.setDescription(data.description);
    this.ticketForEdit = data;
    console.log('this.ticketForEdit', this.ticketForEdit);
    console.log('startDate', new Moment(data.startDate));
    this.selectClient({ item: data.company });
    this.companiesState.setCompanyFromtEdit(data.company);
  
    this.devicesService.onInitHangle(data.company.id);
    this.selectedClient = data.company;
    
 
    this.createService.getStateDatePicker().onInitEditMode(data.startDate);
    this.products = (data.products.length > 0) ? this.createService.getProductsForEdit(data.products) : [new ForCreateProduct()];
    this.services = (data.services.length > 0) ? this.createService.getServicesForEdit(data.services, data.serviceErrors) : [new ForCreateService()];

    this.createService.setTagsForEdit(data.tags);
    this.createService.setCreateTask(data.createTask);
    this.createService.setRequireUpdate(data.requireUpdate);
    this.createService.setQuickClose(data.quickClose);
    this.createService.getTehState().setUsersFromtEdit(data.assignedUsers);
    this.createService.setCronForEdit(data.cronExpression);
    this.onChangeCron(data.cronExpression)
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

    if (data !== null) this.validate.resetInterval();
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
    this.createService.getStateDatePicker().onInitReset();
  
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
    this.validate.resetCompany();
    if (selectClient === 'null') {

      this.recurringState.getCreateTicket().setCompany(null);
    
      this.selectedClient = null;
      this.recurringState.setClient(selectClient);
      this.services = [new ForCreateService()];
    } else {


      this.recurringState.getCreateTicket().setCompany(selectClient.item.id);
    
      this.selectedClient = selectClient.item;
      this.recurringState.setClient(selectClient);
      if (this.ticketForEdit !== null && this.ticketForEdit.company.name !== this.recurringState.getCreateTicket().getCompany()) this.services = [new ForCreateService()];
      this.onCheckListServices();

      this.getCompanyDevices();

    }

    this.cd.detectChanges();

  }
  public showTicketRecurring() {
  /*  this.showTicketRecurringSub = this.ticketStateService.showTicketRecurringAside.subscribe((res) => {
      this.opened = true;
    
      this.onInitCreateMod();
    });*/
  }


  /**
   * set new item
   */
  public selectProduct(item, index) {
    item = { ...item, ...{ quantity: 1, discount: 1 } };
    this.products[index] = new ForCreateProduct(item);
    this.cd.detectChanges();
  }

  public setService(item, index) {
    item = { ...item, ...{ description: '', duration: (this.services[index].duration) ? this.services[index].duration :  1 } };
    
    console.log('item', item);
    this.services[index] = new ForCreateService(item);
    console.log('this.services', this.services);
  }

  public selectDevice(item) {
    this.recurringState.getCreateTicket().clearAgents();
    if (item) this.recurringState.getCreateTicket().setAgents(item.item.agentId);
  }

  public selectDuration(data, i) {
    this.services[i].duration = data.hour + ((data.minutes) ? (data.minutes / 60) : 0);
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

  public onInitCheckProduct() {
    this.recurringState.clearEditProducts();
    if (this.createService.checkProducts(this.products)) {
      this.productList.forEach((category, catIndex) => {
        category.products.forEach((prod, prodIndex) => {
          let index = this.products.findIndex(item => item.versionedId.id === prod.versionedId.id);
          if (index > (-1)) {

            if (this.products[index].manufacture !== prod.manufacture || Number(this.products[index].sale) !== prod.sale || Number(this.products[index].cost) !== prod.cost) {
              this.recurringState.addEditProduct(category, this.products[index]);

            }
          }
        })
      })
    }

    if (this.recurringState.getEditProducts().length > 0) {
      this.recurringService.onInitEditProducts(this.recurringState.getEditProducts()).subscribe(responseList => {

        responseList.forEach((item, index) => {
          this.products[index].versionedId.id = item.id;
          this.products[index].versionedId.version = item.version;
        })
        this.onInitSave();
        this.getItemListProducts();
      }, (err) => {

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
      this.products.forEach((item: ForCreateProduct) => (item.name || item.description) && this.recurringState.getCreateTicket().addProdct(new CreateRecurringTicketsProduct(item.versionedId.id, item.quantity, item.discount)));
    } else {
      if (this.ticketForEdit === null) {
        this.recurringState.getCreateTicket().resetProducts();
      } else {
        this.recurringState.getCreateTicket().clearProducts();
      }
    }
    console.log('this.ticketForEdit',this.ticketForEdit);
    if (this.createService.checkServicesForSave(this.ticketForEdit, this.services)) {
      this.services.forEach((item: ForCreateService) => (item.name || item.description) && this.recurringState.getCreateTicket().addService(new CreateRecurringTicketsService(item.versionedId.id, item.description, item.duration)));
    } else {
      if (this.ticketForEdit === null) {
        this.recurringState.getCreateTicket().resetServices();

      } else {
        this.recurringState.getCreateTicket().clearServices();
      }
    }

console.log('this.recurringState.getCreateTicket()',this.recurringState.getCreateTicket());

    if (this.ticketForEdit && this.ticketForEdit.id) {
      this.recurringState.getCreateTicket().checkForEdit(this.ticketForEdit);
      this.recurringService.editTicket(this.ticketForEdit, this.recurringState.getCreateTicket()).subscribe((res) => {

        this.close();
      })
    } else {

      this.recurringService.createTicket(this.recurringState.getCreateTicket()).subscribe((res) => {

        this.close();
      })
    }
  }

  public save() {

    this.validate.checkValidat(this.recurringState.getCreateTicket());

    if (!this.validate.getCompany() || !this.validate.getInterval()) return;

    console.log('this.recurringState.getCreateTicket()',this.recurringState.getCreateTicket());

    this.onInitCheckProduct();


  }

  public close() {
    this.opened = false;
   
    this.type = "products";
    this.selectedClient = null;
    this.devicesList = [];
    this.tehUsers = [];
    this.companiesState.onInitClear();
    this.createService.getDevicesState().onInitClear();
  
    this.createService.getTagsState().onInitClear();
    this.createService.getTehState().onInitClear();
    this.createService.clearData();
  
    this.createService.getStateDatePicker().onInitClear();
    this.createService.setDefaultDate();
    this.recurringState.clearCreateTicket();
    this.products = [];
    this.services = [];
    this.ticketForEdit = null;
    this.validate = new Validate();

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
