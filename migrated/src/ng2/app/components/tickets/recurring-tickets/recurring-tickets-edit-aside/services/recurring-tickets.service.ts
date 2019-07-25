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
 
  public getDevicesState () {
    return this.devicesState;
  }
  public getTagsState () {
    return this.tagsState;
  }
  public getTehState () {
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

  public getServicesForEdit(list: Array<ServiceRecurringTicket>) {
    let services: Array<ForCreateService> = [];
    list.forEach((item) => {
      let service = new ForCreateService();
      service.setDataFromEdit(item);
      services.push(service);
    })
    return services;
  }
  public setDefaultDate() {
    this.stateInterval.onInitClearState();
  }

  public getDateForDatePicker(time) {
    let date = (time) ? new Date(time) :  new Date();
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }


}
