import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";


import { ProductService } from 'src/ng2/app/services/product/product.service';
import { ForCreateProduct } from '../class/for-create-product';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';
import { ForCreateService } from '../class/for-create-service';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { SelectClientCompanyStateService } from '../../../shared/select-client-company/services/select-client-company-state.service';
import { RecurringTicketsStateService } from '../services/recurring-tickets-state.service';
import { CreateRecurringTicketsProduct } from '../class/create-recurring-tickets-product';
import { CreateRecurringTicketsService } from '../class/create-recurring-tickets-service';
import { RecurringTicketsService } from '../services/recurring-tickets.service';
import { RecurringTicket } from '../class/recurring-ticket';
import { Validate } from '../class/validate';
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
  public type: string = "services";
  public selectedClient: any;
  public devicesList = [];
  public tehUsers = [];
  public ticketForEdit: RecurringTicket = null;
  public validate: Validate = new Validate();

  /**
   * Creates an instance of the RecurringTicketsAddAsideComponent with the injected services
   * @param {ProductService} productService Service to work with products
   * @param {RecurringService} recurringService Service to work with recurring tickets
   * @param {ChangeDetectorRef} cd Service to work with change detector
   * @param {DevicesService} devicesService Service to work with devices
   * @param {SelectClientCompanyStateService} companiesState to work companies state
   * @param {RecurringTicketsStateService} recurringState to work recurring state
   * @param {RecurringTicketsService} createService Service to work with create recurring ticket
   * 
   */
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

  /**
   * Initializes edit recurring ticket. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getItemListProducts();
    this.recurringState.onInitClientList();
    this.onCheckEditMode();

  }

  /**
 * Subscribe to change date picker
 * @param data - date picker data
 */
  public onChangeDatePicker(data: ChangeDatePicker) {
    this.recurringState.getCreateTicket().setStartDate(data.day, data.month, data.year, this.recurringState.getTehCompany().addresses[0].timeZone.timeOffset);
  }

  /**
 * Subscribe to show ticker
 */
  private onCheckEditMode() {
    let editmode = this.recurringState.getEditMode().subscribe((data: RecurringTicket) => {
      this.opened = true;

      this.onEditEditMode(data);
    })
    this.createService.addSubscription(editmode);
  }

  /**
  * Initializes edit mod
  */
  private onEditEditMode(data: RecurringTicket) {
    this.createService.setDescription(data.description);
    this.ticketForEdit = data;
    this.tehUsers = data.assignedUsers;
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
    this.cd.detectChanges();

  }

  /**
    * Subscribe to change tags
    * @param tags - tag data
    */
  public onChangeTags(tags) {
    this.recurringState.getCreateTicket().clearTags();
    tags.forEach((item) => {
      this.recurringState.getCreateTicket().addTag(item.id);
    })
  }

  /**
   * Subscribe to change cron
   * @param data - cron data
   */
  public onChangeCron(data) {

    if (data !== null) this.validate.resetInterval();
    this.recurringState.getCreateTicket().setCronExpression(data);
  }

  /**
  * Subscribe to change description
  * @param event - description event
  */
  public onChangeDescription(event) {
    this.recurringState.getCreateTicket().setDescription(event.target.value);
  }

  /**
   * Subscribe to change teh user
   * @param tehusers - teh users
   */
  public onChangeTehUsers(tehusers) {
    this.tehUsers = tehusers;
    this.recurringState.getCreateTicket().clearTehUsers();
    this.tehUsers.forEach((item) => {
      this.recurringState.getCreateTicket().addAssignedUsers(item.id);
    })

  }

  /**
    * Get company devices
    */
  private getCompanyDevices() {
    let company = this.recurringState.getClient();
    company && this.devicesService.onInitHangle(company.id);
  }

  /**
   * Get product list
   */
  public getItemListProducts() {
    this.productService.getCategories().subscribe((res: any) => {
      this.productList = res;

    });
  }

  /**
  * Check company for services
  */
  public onCheckListServices() {
    const value = this.recurringState.getClient();
    value && this.getListServices(value);
  }

  /**
 * Get list service
 */
  private getListServices(value) {
    this.recurringService.getServiceList(value.id).subscribe((res: any) => {
      this.servicesList = res;
    })
  }

  /**
* Subscribe to change company
* @param selectClient - company
*/
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

  /**
  * Set product item
  * @param item - product
  * @param index - index
  */
  public selectProduct(item, index) {
    item = { ...item, ...{ quantity: 1, discount: 1 } };
    this.products[index] = new ForCreateProduct(item);
    this.cd.detectChanges();
  }

  /**
 * Set service item
* @param item - service
 * @param index - index
 */
  public setService(item, index) {
    item = { ...item, ...{ description: '', duration: (this.services[index].duration) ? this.services[index].duration : 1 } };
    this.services[index] = new ForCreateService(item);
  }

  /**
 * Subscribe to change device
 * @param item - device
 */
  public selectDevice(item) {
    this.recurringState.getCreateTicket().clearAgents();
    if (item) this.recurringState.getCreateTicket().setAgents(item.item.agentId);
  }

  /**
  * Subscribe to change duration
  * @param data - duration
  * @param i - index
  */
  public selectDuration(data, i) {
    this.services[i].duration = data.hour + ((data.minutes) ? (data.minutes / 60) : 0);
  }

  /**
  * Add new product
  */
  public addProduct() {
    let product: ForCreateProduct = new ForCreateProduct();
    this.products.push(product);
    this.cd.detectChanges();
  }

  /**
 * Add new service
 */
  public addService() {
    this.services.push(new ForCreateService());
  }

  /**
  * Remove product
  * @param i - index
  */
  public removeProduct(i) {
    this.products.splice(i, 1);
  }

  /**
  * Remove service
  *  @param i - index
  */
  public removeService(i) {
    this.services.splice(i, 1);
  }

  /**
 * Get name serivce / produuct
 *  @param item - serivce / produuct
 */
  public getNameOrDescription(item) {
    if (item && item.name) return item.name;
    if (item && item.description) return item.description;
    return '';
  }

  /**
   * Check products
   */
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
      });
    } else {
      this.onInitSave();
    }
  }

  /**
 * Initializes save ticket
 */
  public onInitSave() {

    this.recurringState.getCreateTicket().resetProducts();
    this.recurringState.getCreateTicket().resetServices();
    this.createService.setRulesUpdateTicket(this.recurringState.getCreateTicket());

    if (this.createService.checkProductsForSave(this.ticketForEdit, this.products)) {
      this.products.forEach((item: ForCreateProduct) => (item.name || item.description) && this.recurringState.getCreateTicket().addProdct(new CreateRecurringTicketsProduct(item.versionedId.id, item.quantity, item.discount)));
    } else {
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

  /**
 * Save ticket
 */
  public save() {
    this.validate.checkValidat(this.recurringState.getCreateTicket());
    if (!this.validate.getCompany() || !this.validate.getInterval()) return;
    this.onInitCheckProduct();
  }

  /**
 * Close ticket
 */
  public close() {
    this.opened = false;
    this.type = "services";
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
    this.createService.resetEditAdditionalOptions();
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
