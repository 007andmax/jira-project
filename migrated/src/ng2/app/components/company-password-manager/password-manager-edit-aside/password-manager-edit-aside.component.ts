import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, merge, Subscription } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PASSWORD_RECORD_TYPES, PASSWORD_RECORD_TYPES_ENUM } from "../../../const/password-record-types";
import { CompaniesService } from "../../../services/company/companies.service";
import { DevicesService } from "../../../services/devices/devices.service";
import { USER } from "../../../const/users";
import { UsersService } from "../../../services/users/users.service";
import { GadgetsService } from "../../../services/gadgets/gadgets.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { ApiPasswordManagerService } from "../../../services/password-manager/api-password-manager.service";

/**
 * Password manager edit aside component
 */
@Component({
  selector: 'app-company-password-manager-edit-aside',
  templateUrl: './password-manager-edit-aside.component.html',
  styleUrls: ['./password-manager-edit-aside.component.scss']
})
export class CompanyPasswordManagerEditAsideComponent implements OnInit {

  public createPasswordRecord: FormGroup;
  @ViewChild('instance') instance: NgbTypeahead;
  @ViewChild('clientType') clientType: NgbTypeahead;
  @Output() addRecord = new EventEmitter<any>();
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  focusClients$ = new Subject<string>();
  clickClients$ = new Subject<string>();
  public submitted = false;
  public clientsList: any;
  public showHistoryPopup: false;
  public type: any;
  public model: any;
  public currentType;
  public showSelect = false;
  public tabs = ['User', 'Device', 'Not monitored'];
  public currentTab = this.tabs[0];
  public devicesList = [];
  public usersList = [];
  public showGadgetsForm: any;
  public newGadgets: any;
  public gadgets: any;
  public userDevice = [];
  public usersCheckbox = [];
  public deviceCheckbox = [];
  public gadgetCheckbox = [];
  public selectedUserAndDevices = [];
  public selectedClient: any;
  public isEditmode = false;
  public editItem = null;
  public expiryDate;
  public currentTypeChoosen: any;
  public subShowAddForm: Subscription;
  public subHideAddForm: Subscription;
  public subGetGadgets: ISubscription;
  public subGetAllUsers: ISubscription;
  public subSaveEditRecord: ISubscription;
  public subSaveRecord: ISubscription;
  public subGetDevices: ISubscription;
  public subGetCompaniesList: ISubscription;
  public opened: boolean = false;

  /**
   * Creates an instance of the PasswordManagerEditAsideComponent with the injected services
   * @param {ApiPasswordManagerService} apiPasswordManagerService Service to work with api
   * @param {FormBuilder} fb Service to work with form
   * @param {CompaniesService} companiesService Service to work with api
   * @param {DevicesService} devicesService Service to work with api
   * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {userService} userService Service to work with user
   * @param {GadgetsService} gadgetsService Service to work with gadget api
   * @param {permissionsService} permissionsService to work with permissions service
   */
  constructor(
    private passwordManagerService: PasswordManagerService,
    private fb: FormBuilder,
    private companiesService: CompaniesService,
    private devicesService: DevicesService,
    private userService: UsersService,
    private gadgetsService: GadgetsService,
    private permissionsService: PermissionsService,
    private apiPasswordManagerService: ApiPasswordManagerService
  ) { }

  /**
   * Initializes Password manager edit aside. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.showAddForm();
    this.getCLientsList();
    this.type = 0;
    this.currentType = PASSWORD_RECORD_TYPES[0];
    this.hideAddForm();
  }

  /**
   * toggle sidebar and refresh data
   */
  public _toggleSidebar() {
    this.submitted = false;
    this.showSelect = false;
    this.userDevice = [];
    this.initForm();
    this.clearClient();
    this.type = 0;
    this.currentTypeChoosen = PASSWORD_RECORD_TYPES[this.type];
    this.opened = !this.opened;
  }

  /**
   * show add form and init form
   */
  public showAddForm() {
    this.subShowAddForm = this.passwordManagerService.showAddForm.subscribe((res) => {
      this.editItem = res;
      if (this.editItem) this.isEditmode = true;
      this.opened = true;
      return this.initForm();
    });
  }

  /**
   * hide add form and refresh data
   */
  public hideAddForm() {
    this.subHideAddForm = this.passwordManagerService.hideAddForm.subscribe((res) => {
      this.submitted = false;
      this.showSelect = false;
      this.userDevice = [];
      this.initForm();
      this.clearClient();
      this.type = 0;
      this.editItem = null;
      this.selectedUserAndDevices = [];
      this.opened = false;
      this.subShowAddForm.unsubscribe();
    });
  }

  /**
   * change password record type
   * @param event - new type
   */
  public changeType(event) {
    if (event) {
      this.type = PASSWORD_RECORD_TYPES_ENUM[event.UPPERCASE];
    }
  }

  /**
   * init new form
   */
  public initForm(){
    this.expiryDate = this.editItem && this.editItem.expiredDate ? this.getStartDate(this.editItem.expiredDate) : null;
    this.createPasswordRecord = this.fb.group({
      description: [this.editItem ? this.editItem.description : '', Validators.maxLength(5000)],
      client: [this.editItem? this.getEditCompany(this.editItem.companyId) : this.selectedClient, [Validators.required]],
      type: [this.editItem ? this.getEditTemplate(this.editItem.template) : PASSWORD_RECORD_TYPES[0], [Validators.required]],
      ssid: [this.editItem ? this.editItem.ssid : ''],
      userName: [this.editItem ? this.editItem.username : '', [Validators.required, Validators.maxLength(100)]],
      password: [this.editItem ? this.editItem.password : '', [Validators.required, Validators.maxLength(100)]],
      key: [this.editItem ? this.editItem.key : '', [Validators.maxLength(100)]],
      link: [''],
      url: [this.editItem ? this.editItem.url : '', [Validators.maxLength(255)]],
      code: [this.editItem ? this.editItem.code : ''],
      userOrDevice: [this.editItem ? this.editItem.links :''],
      ipAdres: [this.editItem ? this.editItem.ip : '', [Validators.pattern('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]],
      port: [this.editItem ? this.editItem.port : ''],
      expiryDate: [this.editItem ? this.expiryDate : null, []],
      note: [this.editItem ? this.editItem.note : '', [Validators.maxLength(1000)]],
      https: [this.editItem ? this.editItem.https : false],
      ssh: [this.editItem ? this.editItem.ssh : false],
      telnet: [this.editItem ? this.editItem.telnet : false]
    });
  }

  /**
   * save new record
   */
  public save() {
    this.submitted = true;
    const isUserRequired = this.checkLinks();
    const isSsidRequired = this.checkSsid();
    if (this.type === 8) this.createPasswordRecord.controls['userName'].setValue('block');
    if (this.type !== 4) this.createPasswordRecord.controls['ipAdres'].setValue('');
    if (this.createPasswordRecord.invalid || isUserRequired || isSsidRequired) return this.submitted;
    this.createPasswordRecord.controls['userOrDevice'].setValue(this.userDevice);
    if (this.isEditmode && this.editItem) {
      this.subSaveEditRecord = this.passwordManagerService.editRecord(this.createPasswordRecord.value, this.editItem.id)
        .subscribe((res) => this.afterSaveRecord());
    } else {
      this.subSaveRecord = this.passwordManagerService.saveRecord(this.createPasswordRecord.value)
        .subscribe((res) => this.afterSaveRecord());
    }
  }

  /**
   * run methods after record is saved
   */
  public afterSaveRecord() {
    this.addRecord.emit(true);
    this.passwordManagerService.addRecord();
    this.initForm();
    this.showSelect = false;
    this.clearClient();
    this.submitted = false;
    this.type = 0;
    this.opened = false;
  }

  /**
   * check type
   */
  public checkLinks() {
    return (this.type === 4 || this.type === 7) ? this.userDevice.length === 0 : false;
  }

  /**
   * check ssid
   */
  checkSsid() {
    return (this.type === 8 && (this.createPasswordRecord.value.ssid === 0 || !this.createPasswordRecord.value.ssid))
  }

  /**
   * toggle item
   */
  public toggleItem(newItem, type, index) {
    if (type) {
      this.changeSelectedUserAndDevices(newItem, index, type);
      this.changeChecked(type, index);
      const isItem = this.userDevice && this.findItemInUserDevice(newItem, type);
      if (!isItem || isItem.length === 0) {
        this.pushItemToUserDevice(newItem, type);
      } else {
        this.userDevice = this.filterUserDevice(newItem, type)
      }
      this.showGadgetsForm = false;
    }
  }

  /**
   * return form
   */
  get form() {
    return this.createPasswordRecord.controls;
  }

  /**
   * change selected user and device
   */
  public changeSelectedUserAndDevices(newItem, index?, type?) {
    const items =  this.selectedUserAndDevices.filter((item) => {
      return (item.item.id !== newItem.id)
    });
    if (items.length <  this.selectedUserAndDevices.length) {
      return this.selectedUserAndDevices = items;
    } else {
      return this.selectedUserAndDevices.push({
        item: newItem,
        index: index,
        type: type
      });
    }
  }

  /**
   * push item to user device
   * @param newItem - new item
   * @param type - type of new item
   */
  private pushItemToUserDevice( newItem, type) {
    if (type === 'device') {
      this.userDevice.push({deviceId: newItem.id})
    } else if (type === 'user'){
      this.userDevice.push({userId: newItem.id})
    } else {
      this.userDevice.push({gadgetId: newItem.id})
    }
  }

  /**
   * filter user and device
   * @param newItem - item
   * @param type - type of item
   */
  private filterUserDevice(newItem, type) {
    if (type === 'device') {
      return this.userDevice.filter((item) => item.deviceId !== newItem.id);
    } else if (type === 'user'){
      return this.userDevice.filter((item) => item.userId !== newItem.id);
    } else {
      return this.userDevice.filter((item) => item.gadgetId !== newItem.id);
    }
  }

  /**
   * filter item in user and device
   * @param newItem - item
   * @param type - type of item
   */
   private findItemInUserDevice(newItem, type) {
    if (type === 'device') {
      return this.userDevice.filter((item) => item.deviceId === newItem.id);
    } else if (type === 'user'){
      return this.userDevice.filter((item) => item.userId === newItem.id);
    } else {
      return this.userDevice.filter((item) => item.gadgetId === newItem.id);
    }
  }

  /**
   * get company devices
   * @param companyId - company id
   */
  public getCompanyDevices(companyId) {
    this.selectedClient = companyId.item;
    this.clearClient();
    companyId.item && this.getAllUsers(companyId.item.id);
    this.getGadgets();
    this.subGetDevices = this.devicesService.getCompanyDevices(companyId.item.id).subscribe((res) => {
      if (res[companyId.item.id]) {
        this.deviceCheckbox = new Array([...res[companyId.item.id]].length);
        this.showGadgetsForm = false;
        for (var i = 0; i < this.deviceCheckbox.length; ++i) { this.deviceCheckbox[i] = false; }
        this.devicesList = [...res[companyId.item.id]];
        if (this.isEditmode && this.editItem) {
          this.editItem.links.map((item) => {
            const index = this.devicesList.findIndex((deviceListItem) => {
              return deviceListItem.id === item.deviceId
            });
            if (index > -1) {
              this.toggleItem(this.devicesList[index], 'device', index);
            }
          });
        }
      }
    });
    return this.selectedClient;
  }

  /**
   * search method for bootstrap select
   */
  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => PASSWORD_RECORD_TYPES.sort().slice(0,9))
    );
  };

  /**
   * clear client
   */
  public clearClient() {
    this.selectedClient = null;
    this.devicesList = [];
    this.usersList = [];
    this.gadgets = [];
    this.deviceCheckbox = [];
    this.usersCheckbox = [];
    this.userDevice = [];
    this.gadgetCheckbox = [];
    this.selectedUserAndDevices = [];
  }

  /**
   * search client for bootstrap select
   */
  public searchClients = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickClients$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focusClients$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.clientsList
        : this.clientsList && this.clientsList
        .filter(v => v['name'].toLowerCase().indexOf(term.toLowerCase()) > -1)))
    );
  };

  /**
   * formatter for bootstrap select
   */
  public formatter = (result: string) => {
    return result['TITLE'];
  };

  /**
   * formatter clients for bootstrap select
   */
  public formatterClients = (result: string) => {
    return result['name'];
  };

  /**
   * get client list
   */
  public getCLientsList() {
    this.subGetCompaniesList = this.companiesService.clientsCompany.subscribe((res: any) => {
      this.clientsList = res
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((item) => !item.deletedAt)
    })
  }

  /**
   * show selecct wrapper
   */
  public showSelectWrapper($event) {
    this.showSelect = !this.showSelect;
    this.stopEvent($event);
  }

  /**
   * hide select wrapper
   */
  public hideSelectWrapper() {
    this.showSelect = false;
    this.showGadgetsForm = false;
  }

  /**
   * set current tab
   */
  public setCurrentTab($event, item) {
    this.stopEvent($event);
    this.currentTab = item;
    this.showGadgetsForm = false;
  }

  /**
   * get all users
   */
  private getAllUsers(companyId) {
    this.subGetAllUsers = this.userService.getAllusers().subscribe((res: any) => {
      res = res.filter((item) =>  item.company.id == companyId && !item.deletedAt);
      this.usersList = [...(res.filter((item) => item.accountType === USER.TYPE.CLIENT))];
      this.usersCheckbox = new Array(this.usersList.length);
      for (var i = 0; i < this.usersCheckbox.length; ++i) { this.usersCheckbox[i] = false; }
      if (this.isEditmode && this.editItem) {
        this.editItem.links.map((item) => {
          const index = this.usersList.findIndex((userListItem) => {
            return userListItem.id === item.userId
          });
          if (index > -1) {
            this.toggleItem( this.usersList[index], 'user', index);
          }
        });
      }
    })
  }

  /**
   * add gadgets form
   */
  public addGadgetsform() {
    const clientCompanyId = this.createPasswordRecord.value.client.id;
    const name = this.newGadgets;
    this.gadgetsService.addNewGadget(clientCompanyId, name).subscribe((res) => {
      this.gadgets.push(res);
      this.showGadgetsForm = false;
    })
  }

  /**
   * get show gadgets add form
   */
  public showGadgetsAddForm($event) {
    this.stopEvent($event);
    this.showGadgetsForm = !this.showGadgetsForm;
  }

  /**
   * get gadgets
   */
  public getGadgets() {
    this.subGetGadgets = this.gadgetsService.getCompanyDevices().subscribe((res: any) => {
      this.gadgets = [...res];
      this.gadgetCheckbox = new Array(this.gadgets.length);
      for (var i = 0; i < this.gadgetCheckbox.length; ++i) {

        this.gadgetCheckbox[i] = false;
      }
      if (this.isEditmode && this.editItem) {
        this.editItem.links.map((item) => {
          const index = this.gadgets.findIndex((gadgetListItem) => {
            return gadgetListItem.id === item.gadgetId
          });
          if (index > -1) {
            this.toggleItem(this.gadgets[index], 'gadget', index);
          }
        });
      }
    });
  }

  /**
   * stop event
   */
  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  /**
   * delete gadget
   */
  public deleteGadget($event, id) {
    this.stopEvent($event);
    this.gadgetsService.deleteGadget(id)
      .subscribe((res: any) => this.gadgets = this.gadgets.filter((item) => item.id !== id))
  }

  /**
   * change checked
   */
  public changeChecked(type, i) {
    if (type === 'user') {
      this.usersCheckbox[i] = !this.usersCheckbox[i];
    } else if (type === 'device') {
      this.deviceCheckbox[i] = !this.deviceCheckbox[i];
    } else {
      this.gadgetCheckbox[i] = !this.gadgetCheckbox[i];
    }
  }

  /**
   * get history date
   */
  public getHistoryDate(date) {
    return moment(date).format('DD MMMM, YYYY')
  }

  /**
   * get edit template
   */
  public getEditTemplate(template) {
    const index  = PASSWORD_RECORD_TYPES.findIndex((item) => item.UPPERCASE === template);
    this.currentType = PASSWORD_RECORD_TYPES[index];
    this.changeType(this.currentType);
    return PASSWORD_RECORD_TYPES[index];
  }

  /**
   * get edit compnay
   */
  public getEditCompany(id) {
    if (this.clientsList) {
      const company = this.clientsList.filter((item) => item.id === id);
      this.getCompanyDevices({item: company[0]});
      return this.selectedClient = company[0];
    }
  }

  /**
   * get start date
   */
  public getStartDate(date) {
    const dateTime = moment(date);
    return ({
      month: parseInt(dateTime.format('M')),
      year: parseInt(dateTime.format('YYYY')),
      day: parseInt(dateTime.format('D'))
    });
  }

  /**
   * delete record
   */
  public deleteRecord(recordId){
    this.passwordManagerService.deleteRecordFromEditForm(recordId);
    this.hideAddForm();
  }

  /**
   * getPermission
   */
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }

  /**
   * Destroy password manager edit component
   */
  ngOnDestroy() {
    this.apiPasswordManagerService.deleteSubscription();
    this.subShowAddForm && this.subShowAddForm.unsubscribe();
    this.subHideAddForm && this.subHideAddForm.unsubscribe();
    this.subGetGadgets && this.subGetGadgets.unsubscribe();
    this.subGetAllUsers && this.subGetAllUsers.unsubscribe();
    this.subSaveEditRecord && this.subSaveEditRecord.unsubscribe();
    this.subSaveRecord && this.subSaveRecord.unsubscribe();
    this.subGetDevices && this.subGetDevices.unsubscribe();
    this.subGetCompaniesList && this.subGetCompaniesList.unsubscribe();
  }

  /**
   * Show history
   */
  showHistory($event) {
    this.stopEvent($event);
    // @ts-ignore
    this.showHistoryPopup = !this.showHistoryPopup;
  }

}
