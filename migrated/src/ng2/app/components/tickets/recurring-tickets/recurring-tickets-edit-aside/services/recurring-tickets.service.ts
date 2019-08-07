import { Injectable, ElementRef } from '@angular/core';
import { CreateRecurringTickets } from '../class/create-recurring-tickets';
import { Subscribable, Subscription } from 'rxjs';
import { RecurringTicketAgent } from '../../interfaces/recurring-ticket-agent';
import { ProductRecurringTicket } from '../../interfaces/product-recurring-ticket';
import { ForCreateProduct } from '../../class/for-create-product';
import { ForCreateService } from '../../class/for-create-service';
import { ServiceRecurringTicket } from '../../interfaces/service-recurring-ticket';
import { TagsStateService } from 'src/ng2/app/components/shared/tags/services/tags-state.service';
import { IntervalStateService } from 'src/ng2/app/components/shared/interval/services/interval-state.service';
import { TehUsersSateService } from 'src/ng2/app/components/shared/teh-users/services/teh-users-sate.service';
import { DevicesStateService } from '../../devices-recurring-tickets/services/devices-state.service';
import { DurationStateService } from 'src/ng2/app/components/shared/duration/services/duration-state.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ServiceErrors } from '../../class/service-errors';
import { RecurringTicket } from '../../class/recurring-ticket';
import { create } from 'domain';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';

@Injectable()
export class RecurringTicketsService {
  sub: Subscription = new Subscription();
 
  constructor(private elRef: ElementRef, private tagsState: TagsStateService,
    private stateInterval: IntervalStateService,
    private tehState: TehUsersSateService,
    private devicesState: DevicesStateService,
  

  ) { }
  public setRulesCreateTicket(data: CreateRecurringTickets) {

    data.setRequireUpdate(this.elRef.nativeElement.querySelector('#requireUpdate').checked);
    data.setQuickClose(this.elRef.nativeElement.querySelector('#quickClose').checked);
    data.setCreateTask(this.elRef.nativeElement.querySelector('#createTask').checked);

  }


  public setCronForEdit(data) {
    this.stateInterval.onInitEditMode(data);
  }
  public getIntervalState() {
    return this.stateInterval;
  }
  public getDevicesState() {
    return this.devicesState;
  }
  public getTagsState() {
    return this.tagsState;
  }
  public getTehState() {
    return this.tehState;
  }
  public clearData() {
    this.elRef.nativeElement.querySelector('#service-description').value = '';
  }
  public setDescription(val) {
    this.elRef.nativeElement.querySelector('#service-description').value = val;
  
  }
  public addSubscription(data) {
    this.sub.add(data);
  }
  public clearSubscriptions() {
    this.sub.unsubscribe();
  }
  public getNavDate(date: Date) {
    return {
      next: {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      }
    };
  }
  public setTagsForEdit(tags) {
    this.tagsState.setTagsFromtEdit(tags);
  }
  public setRequireUpdate(requireUpdate) {
    this.elRef.nativeElement.querySelector('#requireUpdate').checked = requireUpdate;
  }
  public setQuickClose(quickClose) {
    this.elRef.nativeElement.querySelector('#quickClose').checked = quickClose;
  }
  public setCreateTask(createTask) {
    this.elRef.nativeElement.querySelector('#createTask').checked = createTask;
  }
  public getProductsForEdit(list: Array<ProductRecurringTicket>) {
    let products: Array<ForCreateProduct> = [];
    list.forEach((item) => {
      let product = new ForCreateProduct();
      product.setDataFromEdit(item);
      products.push(product);
    })
    return products;
  }

  public getServicesForEdit(list: Array<ServiceRecurringTicket>,serviceErrors:Array<ServiceErrors>) {
    let services: Array<ForCreateService> = [];
    console.log('serviceErrors',serviceErrors);
    list.forEach((item) => {
      let service = new ForCreateService();
      let errors = [];
      if (serviceErrors instanceof Array)
      {
        serviceErrors.forEach((error) => {
          if (error.id === item.service.versionedId.id)
          {
            errors = error.errors;
          }
        })
      }
     
      service.setDataFromEdit(item,errors);
      services.push(service);
    })
    return services;
  }
  public checkErrorsProducts(list: Array<ForCreateProduct>,validationResults) {
    let products: Array<ForCreateProduct> = [];
    list.forEach((item) => {
        let error:string = validationResults.sale;
        let id = error.substring(0,error.indexOf(";"));
        if (item.versionedId.id === id)  {
          item.setErros([error.substring(error.indexOf(";") + 1,error.length)]);
        } else {
          item.clearErros();
        }
    })
   
    products = list;
    return products;
  }
  public setDefaultDate() {
    this.stateInterval.onInitClearState();
  }

  public getDateForDatePicker(time) {
    let date = (time) ? new Date(time) : new Date();
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }
  public setTextInput(id, val) {
    this.elRef.nativeElement.querySelector(`#${id}`).value = val;
  }

  public checkProducts(products: Array<ForCreateProduct>) {
    if (products.length === 0) return false;
    let retulst = true;
    products.forEach((item) => {
     
      if (item.versionedId === undefined) return retulst = false;
    })
    return retulst;
  }
  public checkProductsForSave(ticketForEdit: RecurringTicket ,products: Array<ForCreateProduct>) {
    let change = false;
    if (ticketForEdit !== null) {
    
      ticketForEdit.products.forEach((product,index) => {
        
        if (index >= products.length || product.product.manufacture !== products[index].manufacture || product.product.cost !== Number(products[index].cost) || products[index].quantity !== Number(product.quantity) || products[index].sale !== Number(product.product.sale) || products[index].discount !== Number(product.discount)) change = true;
     
      })
      console.log("ticketForEdit.products[0]",ticketForEdit.products[0]);
      if (!ticketForEdit.products[0] && products[0].versionedId) change = true;
    } 
   
    return change;
  }

  public checkServicesForSave(ticketForEdit: RecurringTicket ,services: Array<ForCreateService>) {
    let change = false;
    if (ticketForEdit !== null) {
    
      ticketForEdit.services.forEach((service,index) => {
        
        if (index >= services.length || service.duration !== service[index].duration || service.serviceDescription !== services[index].description) change = true;
      })
      if (!ticketForEdit.services[0] && services[0].versionedId) change = true;
    } 
   
    return change;
  }
  public validateTicket (create: CreateRecurringTickets) {
    if (create.getCompany() !== null && create.getCrone() !== null) return true;
    return false;

  }
}
