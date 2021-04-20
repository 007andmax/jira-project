import { Injectable, EventEmitter } from '@angular/core';
import { CreateRecurringTickets } from '../class/create-recurring-tickets';
import { RecurringTicket } from '../class/recurring-ticket';
import { Ticket } from '../../class/ticket';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { EditProduct } from 'src/app/interfaces/product/edit-product';


@Injectable({
  providedIn: 'root'
})
export class RecurringTicketsStateService {
  create: CreateRecurringTickets = new CreateRecurringTickets();
  public client: any;
  public onEditMode: EventEmitter<any> = new EventEmitter();
  public onCopyCreate: EventEmitter<any> = new EventEmitter();
  public showTicketAddRecurringAside: EventEmitter<any> = new EventEmitter();
  editProducts: Array<EditProduct> = [];
  tehCompany: any = null;
  constructor(private companiesService: CompaniesService) {
    this.onInitTehCompany();
  }

  /**
* Subscribe to change teh company
*/
  public onInitTehCompany() {
    this.companiesService.getTechCompany().subscribe((res) => {
      this.tehCompany = res;
    });
  }

  public onInitCopyCreate(data) {
    this.onCopyCreate.emit(data);
  }

  public getOnCopyCreate() {
    return this.onCopyCreate;
  }

  /**
* Get teh company
*/
  public getTehCompany() {
    return this.tehCompany;
  }


  /**
* Set company
* @param client - company
*/
  public setClient(client) {
    this.client = client.item;
  }

  /**
* clear edit product
*/
  public clearEditProducts() {
    this.editProducts = [];
  }

  /**
* Get edit product
*/
  public getEditProducts() {
    return this.editProducts;
  }

  /**
* Add product for edit
*  @param category - category
*  @param prod - product
*/
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

  /**
* Get company
*/
  public getClient() {
    return this.client;
  }

  /**
* Get create ticket data
*/
  public getCreateTicket() {
    return this.create;
  }

  /**
* Set edit ticket for subscribe
* @param item - ticket
*/
  public onInitEditTicket(item: RecurringTicket) {
    this.onEditMode.emit(item);
  }

  /**
* Get edit mode
*/
  public getEditMode() {
    return this.onEditMode;
  }

  /**
 * Clear data for add ticket
 */
  public clearCreateTicket() {
    this.create = new CreateRecurringTickets();
  }

  /**
 * Set subscribe for show add modal
 */
  public toggleTicketAddRecurringAside() {
    this.showTicketAddRecurringAside.emit();
  }

  /**
* Get type cron
*  @param cron - cron
*/
  public getTypeCron(cron: string) {
    if (cron.match(/\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)* \*/)) {
      return "Weekly";
    } else if (cron.match(/\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
      return "Daily";
    }
    return "Monthly";
  }
}
