
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { ProductService } from 'src/app/services/product/product.service';
import { ForCreateProduct } from '../class/for-create-product';
import { RecurringService } from 'src/app/services/recurring/recurring.service';
import { ForCreateService } from '../class/for-create-service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { RecurringTicketsStateService } from '../services/recurring-tickets-state.service';
import { ChangeDatePicker } from '../../../shared/date-picker/class/change-date-picker';
import { RecurringTicketsService } from '../services/recurring-tickets.service';
import { Validate } from '../class/validate';
import { CreateRecurringTicketsProduct } from '../class/create-recurring-tickets-product';
import { CreateRecurringTicketsService } from '../class/create-recurring-tickets-service';
import { DevicesRecurringTicketsStateService } from '../devices-recurring-tickets/services/devices-recurring-tickets-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TechUserItem } from '../../../shared/tech-users/class/tech-user-item';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { DevicesRecurringTicketsComponent } from '../devices-recurring-tickets/devices-recurring-tickets.component';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { AssignedTicketUserComponent } from '../../tickets/ticket-add-aside/assigned-ticket-user/assigned-ticket-user.component';
import { CompanyDropDownComponent } from 'src/app/components/shared/company-drop-down/company-drop-down.component';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';
import { DurationComponent } from 'src/app/components/shared/duration/duration.component';
import { IntervalComponent } from 'src/app/components/shared/interval/interval.component';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';
import { ProductListComponent } from 'src/app/components/shared/product-list/product-list.component';
import { ServicesListComponent } from 'src/app/components/shared/services-list/services-list.component';
import { TagsComponent } from 'src/app/components/shared/tags/tags.component';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { PreloaderTicketComponent } from 'src/app/components/shared/preloader-ticket/preloader-ticket.component';
import { DecimalNumberDirective } from 'src/app/directives/decimal-number/decimal-number.directive';
import { ToFixedDirective } from 'src/app/directives/to-fixed/to-fixed.directive';

@Component({
  standalone: true,
  imports: [DatePickerComponent, PreloaderTicketComponent, ToFixedDirective, DecimalNumberDirective, DisabledBtnDirective, AssignedTicketUserComponent, DevicesRecurringTicketsComponent, DurationComponent, IntervalComponent, MatErrorComponent, ProductListComponent, ServicesListComponent, TagsComponent, CompanyDropDownComponent, FormsModule, CommonModule],
  selector: 'app-recurring-tickets-add-aside',
  templateUrl: './recurring-tickets-add-aside.component.html',
  styleUrls: ['./recurring-tickets-add-aside.component.scss'],
  providers: [RecurringTicketsService],

})
export class RecurringTicketsAddAsideComponent implements OnInit, OnDestroy {

  public showTicketRecurringSub: Subscription;
  public opened = false;
  public productList = [];
  public servicesList = [];
  public products: Array<ForCreateProduct> = [];
  public services: Array<ForCreateService> = [];
  public type: string = "services";
  public selectedClient: any;
  public techUsers = [];
  public listTechUsers: Array<TechUserItem> = [];
  public validate: Validate = new Validate();
  copy: boolean = false;
  formatDate: string = FORMAT_DATE_2;
  @ViewChild('deviceDp', { static: false }) deviceDp: DevicesRecurringTicketsComponent;
  sub: Subscription = new Subscription();
  @ViewChild('techUsersDp', { static: false }) techUsersDp: AssignedTicketUserComponent;
  @ViewChild('saveBtn', { static: false }) saveBtn: DisabledBtnDirective;
  @ViewChild('copyBtn', { static: false }) copyBtn: DisabledBtnDirective;
  /**
   * Creates an instance of the RecurringTicketsAddAsideComponent with the injected services
   * @param {ProductService} productService Service to work with products
   * @param {RecurringService} recurringService Service to work with recurring tickets
   * @param {ChangeDetectorRef} cd Service to work with change detector
   * @param {DevicesService} devicesService Service to work with devices
     * @param {RecurringTicketsStateService} recurringState to work recurring state
   * @param {RecurringTicketsService} createService Service to work with create recurring ticket
  
   * 
   */
  constructor(
    private productService: ProductService,
    private recurringService: RecurringService,
    public cd: ChangeDetectorRef,
    public recurringState: RecurringTicketsStateService,
    public createService: RecurringTicketsService,
    private devicesRecurringTicketsStateService: DevicesRecurringTicketsStateService,
    private usersStateService: UsersStateService,
    private contractsService: ContractsService,
    private inventoryStateService: InventoryStateService,
  ) {
  }

  /**
    * Initializes add recurring ticket. See [ngOnInit]{@see OnInit#ngOnInit}
    */
  ngOnInit() {
    this.showTicketRecurring();
    //this.recurringState.onInitClientList();
    this.onCopyCreate();

    if (this.usersStateService.getAllUsers().length > 0) this.onGetTechUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.onGetTechUsers(this.usersStateService.getAllUsers());
    })
    this.sub.add(onChangeUsers);
  }

  public onCopyCreate() {
    this.recurringState.getOnCopyCreate().subscribe(data => {

      this.opened = true;
      this.onInitCreateMod();
      this.onInitCloneCreate(data);
    })
  }

  private onInitCloneCreate(data) {
    this.createService.onInitClone();
    this.createService.setDescription(data.description);
    this.recurringState.getCreateTicket().setDescription(data.description);
    this.techUsers = data.assignedUsers;


    this.devicesRecurringTicketsStateService.onInitHangle(data.company.id);
    this.selectedClient = data.company;
    this.createService.getStateDatePicker().onInitEditMode(new Date().getTime());
    let currentDate = new Date();
    this.onChangeDatePicker(new ChangeDatePicker(currentDate.getDate(), currentDate.getMonth() + 1, currentDate.getFullYear()))

    this.services = (data.services.length > 0) ? [] : [new ForCreateService()];
    let services = [];
    data.services.forEach((service, index) => {
      let new_service = new ForCreateService();
      new_service.onInitCopyCrete(service);
      services.push(new_service);

    });
    this.services = (data.services.length > 0) ? services : [new ForCreateService()];;


    this.products = (data.products.length > 0) ? this.createService.getProductsForEdit(data.products) : [new ForCreateProduct()];
    this.createService.setTagsForEdit(data.tags);
    data.tags.forEach(item => this.recurringState.getCreateTicket().addTag(item.id));
    this.createService.setCreateTaskAdd(data.createTask);
    this.createService.setRequireUpdateAdd(data.requireUpdate);
    this.createService.setQuickCloseAdd(data.quickClose);
    this.createService.getTechState().setUsersFromtEdit(data.assignedUsers);
    data.assignedUsers.forEach(item => this.recurringState.getCreateTicket().addAssignedUsers(item.id));
    this.createService.setCronForEdit(data.cronExpression);
    this.onChangeCron(data.cronExpression)
    this.getListServices(data.company);

    this.cd.detectChanges();

  }

  /**
  * Subscribe to change date picker
  * @param data - date picker data
  */
  public onChangeDatePicker(data: ChangeDatePicker) {

    this.recurringState.getCreateTicket().setStartDate(data.day, data.month, data.year, this.recurringState.getTechCompany().addresses[0].timeZone.timeOffset);
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

  public onPastDescription(value) {

    this.recurringState.getCreateTicket().setDescription(value);
  }

  /**
  * Subscribe to change description
  * @param event - description event
  */
  public onChangeDescription(event) {
    this.recurringState.getCreateTicket().setDescription(event.target.value);

  }

  /**
  * Initializes add mod
  */
  private onInitCreateMod() {
    this.products = [new ForCreateProduct()];
    this.services = [new ForCreateService()];
    this.recurringState.getCreateTicket().clearTechUsers();
    this.recurringState.getCreateTicket().clearTags();
    this.recurringState.getCreateTicket().clearAgents();
    this.recurringState.getCreateTicket().setDefaultCron();
    // this.createService.getStateDatePicker().onInitReset();
    let date = new Date();
    this.recurringState.getCreateTicket().setStartDate(date.getDate(), date.getMonth() + 1, date.getFullYear(), this.recurringState.getTechCompany().addresses[0].timeZone.timeOffset);
    this.cd.detectChanges();
  }

  /**
  * Subscribe to change teсh user
  * @param techusers - teсh users
  */
  public onChangeTechUsers(techusers) {
    this.techUsers = techusers;
    this.recurringState.getCreateTicket().clearTechUsers();
    this.techUsers.forEach((item) => {
      this.recurringState.getCreateTicket().addAssignedUsers(item.id);
    })
  }

  private onGetTechUsers(data) {
    this.listTechUsers = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return new TechUserItem(item);
      }
    });
    // this.techUsersDp.reset(this.listTechUsers);
  }

  /**
    * Get company devices
    */
  private getCompanyDevices() {
    this.devicesRecurringTicketsStateService.onInitHangle(this.selectedClient.id);
  }

  /**
   * Get product list
   */
  public getItemListProducts() {
    this.inventoryStateService.setPreloader(true);
    this.productService.getCategories().subscribe((res: any) => {
      this.productList = res;
      this.inventoryStateService.setproducts(this.productList);
      this.inventoryStateService.onInitGetProducts(this.productList);
      this.inventoryStateService.setPreloader(false);
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
    this.deviceDp.clearDevices();
    if (selectClient == null) {
      this.recurringState.getCreateTicket().setCompany(null);
      this.selectedClient = null;
      this.recurringState.setClient(selectClient);

    } else {
      this.recurringState.getCreateTicket().setCompany(selectClient.id);
      this.selectedClient = selectClient;
      this.recurringState.setClient(selectClient);
      this.onCheckListServices();
      this.getCompanyDevices();
    }
    if (this.services[0] instanceof ForCreateService) {

      let servicesOld = JSON.parse(JSON.stringify(this.services));
      this.services = [];
      let services = [];
      //  this.cd.detectChanges();
      servicesOld.forEach((service, index) => {
        let newService = { description: service.description, duration: (service.duration) ? service.duration : 1, name: '' }
        let new_service = new ForCreateService(newService);
        services.push(new_service);
      });

      this.services = services;
    }


    //  this.services = [new ForCreateService()];
    this.cd.detectChanges();

  }
  onChangeCost(val, product) {
    let value = Number(val);
    product.cost = value;
    product.cost_str = value.toFixed(2);
  }
  onChangeSale(val, product) {
    let value = Number(val);
    product.sale = value;
    product.sale_str = value.toFixed(2);
  }
  /**
 * Subscribe to show ticker
 */
  public showTicketRecurring() {
    let showTicketAddRecurringAside = this.recurringState.showTicketAddRecurringAside.subscribe((res) => {
      this.opened = true;
      this.getItemListProducts();
      this.onInitCreateMod();
    });
    this.sub.add(showTicketAddRecurringAside);
  }


  /**
  * Set product item
  * @param item - product
  * @param index - index
  */
  public selectProduct(item, index) {
    item = (item) ? { ...item, ...{ quantity: 1, discount: 1 } } : null;
    this.products[index] = new ForCreateProduct(item);
    this.products[index].setDiscount(0);
    this.cd.detectChanges();
  }

  public onPastDescriptionService(value, i) {
    this.services[i].description = value;
  }

  /**
  * Set service item
 * @param item - service
  * @param index - index
  */
  public setService(item, index) {
    let newItem = { ...item, ...{ description: this.services[index].description, duration: (this.services[index].duration) ? this.services[index].duration : 1 } };
    // let  service = new ForCreateService(newItem);
    this.services[index] = new ForCreateService(newItem);
    /*  this.services[index].setName(item.name);
      this.services[index].setVersionedId(item.setVersionedId);
      this.services[index].setDuration( (this.services[index].duration) ? this.services[index].duration : 1);*/
    this.cd.detectChanges();
    /*  if (this.services[index] instanceof ForCreateService && this.services[index].versionedId) {
      
        this.services[index].setName(item.name);
        this.services[index].setVersionedId(item.setVersionedId);
      } else {
        item = { ...item, ...{ description: '', duration: (this.services[index].duration) ? this.services[index].duration : 1 } };
        this.services[index] = new ForCreateService(item);
      }*/
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
        this.onCompleteAdd();
        this.getItemListProducts();
      }, (err) => {

        this.createService.checkErrorsProducts(this.products, err.error.validationResults);

      });
    } else {
      this.onCompleteAdd();
    }
  }

  /**
  * Initializes copy ticket
  */
  public onInitAddAndCopy() {
    this.copy = true;
    this.onInitAdd();
  }

  /**
 * Complated add
 */
  public onCompleteAdd() {

    this.recurringState.getCreateTicket().resetProducts();
    this.recurringState.getCreateTicket().resetServices();
    this.createService.setRulesCreateTicket(this.recurringState.getCreateTicket());
    this.products.forEach((item: ForCreateProduct) => (item.name || item.description) && this.recurringState.getCreateTicket().addProdct(new CreateRecurringTicketsProduct(item.versionedId.id, item.quantity, item.discount)));
    this.services.forEach((item: ForCreateService) => (item.name) && this.recurringState.getCreateTicket().addService(new CreateRecurringTicketsService(item.versionedId.id, item.description, item.duration, item.discountAmount)));
    this.recurringService.createTicket(this.recurringState.getCreateTicket()).subscribe((res) => {
      this.saveBtn.setDisabled(false);
      this.copyBtn.setDisabled(false);
      if (!this.copy) {
        this.close();
      } else {
        this.copy = false;
        this.resetDataForCopy();
      }
    })
  }

  /**
    * Initializes to add
    */
  public onInitAdd() {
    this.validate.checkValidat(this.recurringState.getCreateTicket());
    //  if (this.createService.getCloneMode() && this.checkServices()) return; 
    if (!this.validate.getCompany() || !this.validate.getInterval() || this.createService.getCloneMode() && this.checkServices()) return;
    this.saveBtn.setDisabled(true);
    this.copyBtn.setDisabled(true);
    this.onInitCheckProduct();
  }

  private checkServices() {
    this.services.forEach(item => item.checkService());

    let noValid = (this.services.findIndex(item => item.noValid) > -1) ? true : false;
    return noValid;
  }

  /**
   * Closed ticket
   */
  public close() {
    this.opened = false;
    this.type = "services";
    this.selectedClient = null;
    this.techUsers = [];
    this.createService.getDevicesState().onInitClear();
    this.createService.getTagsState().onInitClear();
    this.createService.getTechState().onInitClear();
    this.createService.clearData();
    this.createService.getStateDatePicker().onInitClear();
    this.createService.setDefaultDate();
    this.recurringState.clearCreateTicket();
    this.products = [];
    this.services = [];
    this.validate = new Validate();
    this.copy = false;
    this.createService.resetAddAdditionalOptions();
    this.createService.resetCloneMode();
  }

  public trackById(index, item) {
    return (item.versionedId) ? item.versionedId.id : index;
  }

  public trackByIndex(index, item) {
    return index;
  }

  /**
  * Reset ticket for copy
  */
  private resetDataForCopy() {
    this.createService.getDevicesState().onInitClear();
    this.selectedClient = null;
    // this.services = [new ForCreateService()];
    let dataService = JSON.parse(JSON.stringify(this.services));
    this.services = (this.services.length > 0) ? [] : [new ForCreateService()];
    let services = [];
    dataService.forEach((service, index) => {
      let new_service = new ForCreateService();
      new_service.setDescription(service.description);
      services.push(new_service);

    });
    this.services = (dataService.length > 0) ? services : [new ForCreateService()];

    this.type = "services";
    this.validate = new Validate();
    // this.devicesList = [];
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.createService.clearSubscriptions();
  }

}
