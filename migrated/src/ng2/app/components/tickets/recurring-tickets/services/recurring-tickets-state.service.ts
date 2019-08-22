import { Injectable, EventEmitter } from '@angular/core';
import { CreateRecurringTickets } from '../recurring-tickets-edit-aside/class/create-recurring-tickets';
import { RecurringTicket } from '../class/recurring-ticket';
import { Ticket } from '../../class/ticket';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { RecurringTicketUser } from '../interfaces/recurring-ticket-user';
import { EditProduct } from 'src/ng2/app/interfaces/product/edit-product';
import { Observable } from 'rxjs';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';

@Injectable({
  providedIn: 'root'
})
export class RecurringTicketsStateService {
  create: CreateRecurringTickets = new CreateRecurringTickets();
  public client: any;
  public tecketForCreate: Ticket = new Ticket();
  public onEditMode: EventEmitter<any> = new EventEmitter();
  public showTicketAddRecurringAside: EventEmitter<any> = new EventEmitter();
  editProducts: Array<EditProduct> = [];
  tehCompany:any = null;
  constructor(private companiesService: CompaniesService) {
    this.onInitTehCompany();
   }

  public onInitTehCompany() {
    this.companiesService.getTechCompany().subscribe((res) => {
       this.tehCompany = res;
    });
  }
  public getTehCompany () {
    return this.tehCompany;
  }
  public onInitClientList() {
    this.companiesService.getCompaniesList();
  }
  public setClient(client) {
    this.client = client.item;
    this.tecketForCreate.client = client;
  }
  public clearEditProducts() {
    this.editProducts = [];
  }
  public getEditProducts() {
    return this.editProducts;
  }
  public addEditProduct(category, prod) {
    this.editProducts.push({
      categoryId: category.id,
      cost: Number(prod.cost),
      description: prod.description,
      glNumber: null,
      ilc: null,
      manufacture: prod.manufacture,
      sale: Number(prod.sale),
      taxIds: [],
      versionedId: prod.versionedId
    })
  }
  public getClient() {
    return this.client;
  }
  public getCreateTicket() {
    return this.create;
  }
  public onInitEditTicket(item: RecurringTicket) {
    this.onEditMode.emit(item);
  }
  public getEditMode() {
    return this.onEditMode;
  }
  public clearCreateTicket() {
    this.create = new CreateRecurringTickets();
  }
  public toggleTicketAddRecurringAside() {
    this.showTicketAddRecurringAside.emit();
  }
  public getTypeCron(cron: string) {
    if (cron.match(/\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)* \*/)) {
      return "Weekly";
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
      return "Daily";
    }
    return "Monthly";
  }
}
