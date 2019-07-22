import { Injectable, ElementRef } from '@angular/core';
import { CreateRecurringTickets } from '../class/create-recurring-tickets';
import { Subscribable, Subscription } from 'rxjs';
import { RecurringTicketAgent } from '../../interfaces/recurring-ticket-agent';
import { ProductRecurringTicket } from '../../interfaces/product-recurring-ticket';
import { ForCreateProduct } from '../../class/for-create-product';
import { ForCreateService } from '../../class/for-create-service';
import { ServiceRecurringTicket } from '../../interfaces/service-recurring-ticket';

@Injectable()
export class RecurringTicketsService {
sub:Subscription = new Subscription();
public editAgent:RecurringTicketAgent;
  constructor( private elRef: ElementRef,) { }

  public setRulesCreateTicket(data:CreateRecurringTickets) {
   
    data.setRequireUpdate(this.elRef.nativeElement.querySelector('#requireUpdate').checked);
    data.setQuickClose(this.elRef.nativeElement.querySelector('#quickClose').checked);
    data.setCreateTask(this.elRef.nativeElement.querySelector('#createTask').checked);

  }
  public clearData() {
    this.elRef.nativeElement.querySelector('#service-description').value = '';
  }
  public setDescription (val) {
    this.elRef.nativeElement.querySelector('#service-description').value =val;
  }
  public addSubscription (data) {
    this.sub.add(data);
  }
  public clearSubscriptions () {
   this.sub.unsubscribe();
  }
  public getNavDate(date:Date) {
    return  {next :{
      year: date.getFullYear(),
      month: date.getMonth() + 1
    }};
  }
  public getProductsForEdit (list:Array<ProductRecurringTicket>) {
    let products:Array<ForCreateProduct> = [];
    list.forEach((item) => {
      let product = new ForCreateProduct();
      product.setDataFromEdit(item);
      products.push(product);
    })
    return products;
  }

  public getServicesForEdit (list:Array<ServiceRecurringTicket>) {
    let services:Array<ForCreateService> = [];
    list.forEach((item) => {
      let service = new ForCreateService();
      service.setDataFromEdit(item);
      services.push(service);
    })
    return services;
  }
}
