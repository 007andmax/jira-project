import { Injectable, ElementRef } from '@angular/core';
import { CreateRecurringTickets } from '../class/create-recurring-tickets';
import { Subscription } from 'rxjs';
import { ProductRecurringTicket } from '../interfaces/product-recurring-ticket';
import { ForCreateProduct } from '../class/for-create-product';
import { ForCreateService } from '../class/for-create-service';
import { ServiceRecurringTicket } from '../interfaces/service-recurring-ticket';
import { TagsStateService } from 'src/ng2/app/components/shared/tags/services/tags-state.service';
import { IntervalStateService } from 'src/ng2/app/components/shared/interval/services/interval-state.service';
import { TehUsersSateService } from 'src/ng2/app/components/shared/teh-users/services/teh-users-sate.service';
import { DevicesStateService } from '../devices-recurring-tickets/services/devices-state.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ServiceErrors } from '../class/service-errors';
import { RecurringTicket } from '../class/recurring-ticket';
import { DatePickerStateService } from 'src/ng2/app/components/shared/date-picker/services/date-picker-state.service';

@Injectable()
export class RecurringTicketsService {
  sub: Subscription = new Subscription();
  clone:boolean = false;
  constructor(private elRef: ElementRef, private tagsState: TagsStateService,
    private stateInterval: IntervalStateService,
    private tehState: TehUsersSateService,
    private devicesState: DevicesStateService,
    private stateDatePicker: DatePickerStateService
  ) { }

  public onInitClone() {
    this.clone = true;
  }

  public getCloneMode() {
    return this.clone;
  }
  public resetCloneMode() {
    this.clone = false;
  }

  /**
* Set rules for add ticket 
*  @param data - ticket for add
*/
  public setRulesCreateTicket(data: CreateRecurringTickets) {

    data.setRequireUpdate(this.elRef.nativeElement.querySelector('#requireUpdate-add').checked);
    data.setQuickClose(this.elRef.nativeElement.querySelector('#quickClose-add').checked);
    data.setCreateTask(this.elRef.nativeElement.querySelector('#createTask-add').checked);

  }

  /**
* Set rules for edit ticket 
*  @param data - ticket for edit
*/
  public setRulesUpdateTicket(data: CreateRecurringTickets) {

    data.setRequireUpdate(this.elRef.nativeElement.querySelector('#requireUpdate-edit').checked);
    data.setQuickClose(this.elRef.nativeElement.querySelector('#quickClose-edit').checked);
    data.setCreateTask(this.elRef.nativeElement.querySelector('#createTask-edit').checked);

  }

  /**
* Get state date picker
*/
  public getStateDatePicker() {
    return this.stateDatePicker;
  }

  /**
  * Set cron for edit
  * @param data - cron
  */
  public setCronForEdit(data) {
    this.stateInterval.onInitEditMode(data);
  }

  /**
* Get cron state
*/
  public getIntervalState() {
    return this.stateInterval;
  }

  /**
* Get devices state
*/
  public getDevicesState() {
    return this.devicesState;
  }

  /**
* Get tags state
*/
  public getTagsState() {
    return this.tagsState;
  }

  /**
* Get teh users state
*/
  public getTehState() {
    return this.tehState;
  }

  /**
* Clear description
*/
  public clearData() {
    this.elRef.nativeElement.querySelector('#service-description').value = '';
  }

  /**
* Set description
* @param val - description
*/
  public setDescription(val) {
    this.elRef.nativeElement.querySelector('#service-description').value = val;

  }

  /**
* Add subscription
* @param data - subscription
*/
  public addSubscription(data) {
    this.sub.add(data);
  }

  /**
* clear subscriptions
*/
  public clearSubscriptions() {
    this.sub.unsubscribe();
  }

  /**
* Get date for datepicker
* @param date - date
*/
  public getNavDate(date: Date) {
    return {
      next: {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      }
    };
  }

  /**
 * Reset additional options for add
 */
  public resetAddAdditionalOptions() {
    this.elRef.nativeElement.querySelector('#requireUpdate-add').checked = false;
    this.elRef.nativeElement.querySelector('#quickClose-add').checked = false;
    this.elRef.nativeElement.querySelector('#createTask-add').checked = false;
  }

  /**
 * Reset additional options for edit
 */
  public resetEditAdditionalOptions() {
    this.elRef.nativeElement.querySelector('#requireUpdate-edit').checked = false;
    this.elRef.nativeElement.querySelector('#quickClose-edit').checked = false;
    this.elRef.nativeElement.querySelector('#createTask-edit').checked = false;
  }

  /**
 * Set tags for edit
 * @param tags - tags
 */
  public setTagsForEdit(tags) {
    this.tagsState.setTagsFromtEdit(tags);
  }

  /**
 * Set require update for edit
 * @param requireUpdate - require update
 */
  public setRequireUpdate(requireUpdate) {
    this.elRef.nativeElement.querySelector('#requireUpdate-edit').checked = requireUpdate;
  }

   /**
 * Set require update for add
 * @param requireUpdate - require update
 */
public setRequireUpdateAdd(requireUpdate) {
  this.elRef.nativeElement.querySelector('#requireUpdate-add').checked = requireUpdate;
}

  /**
 * Set quick close for edit
 * @param quickClose - quick close
 */
  public setQuickClose(quickClose) {
    this.elRef.nativeElement.querySelector('#quickClose-edit').checked = quickClose;
  }

  /**
 * Set quick close for add
 * @param quickClose - quick close
 */
public setQuickCloseAdd(quickClose) {
  this.elRef.nativeElement.querySelector('#quickClose-add').checked = quickClose;
}

  /**
 * Set create task for edit
 * @param createTask - create task
 */
  public setCreateTask(createTask) {
    this.elRef.nativeElement.querySelector('#createTask-edit').checked = createTask;
  }

   /**
 * Set create task for add
 * @param createTask - create task
 */
public setCreateTaskAdd(createTask) {
  this.elRef.nativeElement.querySelector('#createTask-add').checked = createTask;
}


  /**
 * Get products for edit
 * @param list - products list
 */
  public getProductsForEdit(list: Array<ProductRecurringTicket>) {
    let products: Array<ForCreateProduct> = [];
    list.forEach((item) => {
      let product = new ForCreateProduct();
      product.setDataFromEdit(item);
      products.push(product);
    })
    return products;
  }

  /**
* Get services for edit
* @param list - service list
* @param serviceErrors - error list
*/
  public getServicesForEdit(list: Array<ServiceRecurringTicket>, serviceErrors: Array<ServiceErrors>) {
    let services: Array<ForCreateService> = [];
     
    list.forEach((item) => {
      let service = new ForCreateService();
      let errors = [];
      if (serviceErrors instanceof Array) {
        serviceErrors.forEach((error) => {
          if (error.id === item.service.versionedId.id) {
            errors = error.errors;
          }
        })
      }

      service.setDataFromEdit(item, errors);
      services.push(service);
    })
    return services;
  }

  /**
 * Check products errors
 * @param list - products list
 * @param validationResults - valid
 */
  public checkErrorsProducts(list: Array<ForCreateProduct>, validationResults) {
    let products: Array<ForCreateProduct> = [];
    list.forEach((item) => {
      let error: string = validationResults.sale;
      let id = error.substring(0, error.indexOf(";"));
      if (item.versionedId.id === id) {
        item.setErros([error.substring(error.indexOf(";") + 1, error.length)]);
      } else {
        item.clearErros();
      }
    })

    products = list;
    return products;
  }

  /**
* Set default date
*/
  public setDefaultDate() {
    this.stateInterval.onInitClearState();
  }

  /**
 * Get default date
 * @param time - milisecongs date
 */
  public getDateForDatePicker(time) {
    let date = (time) ? new Date(time) : new Date();
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  /**
 * Set test input
 * @param id - id input
 * @param val - test
 */
  public setTextInput(id, val) {
    this.elRef.nativeElement.querySelector(`#${id}`).value = val;
  }

  /**
* Check products
* @param products - products
*/
  public checkProducts(products: Array<ForCreateProduct>) {
    if (products.length === 0) return false;
    let retulst = true;
    products.forEach((item) => {

      if (item.versionedId === undefined) return retulst = false;
    })
    return retulst;
  }

  /**
 * Check products for save
 * @param ticketForEdit - ticket
 * @param products - products list
 */
  public checkProductsForSave(ticketForEdit: RecurringTicket, products: Array<ForCreateProduct>) {
    let change = false;
    if (ticketForEdit !== null) {

      ticketForEdit.products.forEach((product, index) => {

        if (index >= products.length || product.product.manufacture !== products[index].manufacture || product.product.cost !== Number(products[index].cost) || products[index].quantity !== Number(product.quantity) || products[index].sale !== Number(product.product.sale) || products[index].discount !== Number(product.discount) || product.product.versionedId.id !== products[index].versionedId.id) change = true;

      })
     
      if (!ticketForEdit.products[0] && products[0].versionedId) change = true;
    } else {
      if (products[0].versionedId) change = true;
    }

    return change;
  }

  /**
* Check services for save
* @param ticketForEdit - ticket
* @param services - services list
*/
  public checkServicesForSave(ticketForEdit: RecurringTicket, services: Array<ForCreateService>) {
    let change = false;
    if (ticketForEdit !== null) {

      ticketForEdit.services.forEach((service, index) => {

        if (index >= services.length || service.duration !== services[index].duration || service.serviceDescription !== services[index].description || service.service.versionedId.id !== services[index].versionedId.id) change = true;
      })
      if (!ticketForEdit.services[0] && services[0].versionedId) change = true;
      if (ticketForEdit.services.length !== services.length) change = true;
    } else {
      if (services[0].versionedId) change = true;
    }

    return change;
  }

}
