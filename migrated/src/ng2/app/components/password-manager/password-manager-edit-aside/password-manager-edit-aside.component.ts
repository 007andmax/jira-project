import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, merge } from 'rxjs';
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

@Component({
  selector: 'app-password-manager-edit-aside',
  templateUrl: './password-manager-edit-aside.component.html',
  styleUrls: ['./password-manager-edit-aside.component.scss']
})
export class PasswordManagerEditAsideComponent implements OnInit {

  public createPasswordRecord: FormGroup;
  @ViewChild('instance') instance: NgbTypeahead;
  @ViewChild('clientType') clientType: NgbTypeahead;
  @Output() addRecord = new EventEmitter<string>();
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  focusClients$ = new Subject<string>();
  clickClients$ = new Subject<string>();
  public submitted = false;
  public clientsList: any;
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
  public selectedClientStart: any;
  public isEditmode = false;
  public editItem = null;
  public expiryDate;
  public showClientType = false;
  public showType = false;
  public currentTypeChoosen: any;
  public typesList = PASSWORD_RECORD_TYPES;

  constructor(
    private passwordManagerService: PasswordManagerService,
    private fb: FormBuilder,
    private companiesService: CompaniesService,
    private devicesService: DevicesService,
    private userService: UsersService,
    private gadgetsService: GadgetsService
  ) { }

  ngOnInit() {
    this.showAddForm();
    this.getCLientsList();
    this.type = 0;
    this.currentType = PASSWORD_RECORD_TYPES[0];
    this.hideAddForm();
  }

  public opened: boolean = false;

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

  public showAddForm() {
    this.passwordManagerService.showAddForm.subscribe((res) => {
      this.editItem = res;
      if (this.editItem) this.isEditmode = true;
      this.opened = true;
      return this.initForm();
    });
  }

  public hideAddForm() {
    this.passwordManagerService.hideAddForm.subscribe((res) => {
      this.submitted = false;
      this.showSelect = false;
      this.userDevice = [];
      this.initForm();
      this.clearClient();
      this.type = 0;
      this.editItem = null;
      this.selectedUserAndDevices = [];
      this.opened = false;
    });
  }

  public changeType(event) {
    if (event) {
      this.type = PASSWORD_RECORD_TYPES_ENUM[event.UPPERCASE];
      this.currentTypeChoosen = event;
      this.showType = false;
    }
  }

  get form() { return this.createPasswordRecord.controls; }

  public initForm(){
    console.log(this.editItem, 'this.editItem');
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
      expiryDate: [this.editItem ? this.editItem.expiredDate : null, []],
      note: [this.editItem ? this.editItem.note : '', [Validators.maxLength(1000)]],
      http: [this.editItem ? this.editItem.http : false],
      ssh: [this.editItem ? this.editItem.ssh : false],
      telnet: [this.editItem ? this.editItem.telnet : false]
    });
  }

  public save() {
    this.submitted = true;
    const isUserRequired = this.checkLinks();
    const isSsidRequired = this.checkSsid();
    if (this.type === 8) this.createPasswordRecord.controls['userName'].setValue('block');
    if (this.type !== 4) this.createPasswordRecord.controls['ipAdres'].setValue('');
    this.createPasswordRecord.controls['client'].setValue(this.selectedClient);
    this.createPasswordRecord.controls['type'].setValue(this.currentTypeChoosen);
    if (this.createPasswordRecord.invalid || isUserRequired || isSsidRequired) return this.submitted;
    this.createPasswordRecord.controls['userOrDevice'].setValue(this.userDevice);
    if (this.isEditmode && this.editItem) {
      this.passwordManagerService.editRecord(this.createPasswordRecord.value, this.editItem.id)
        .subscribe((res) => this.afterSaveRecord());
    } else {
      this.passwordManagerService.saveRecord(this.createPasswordRecord.value)
        .subscribe((res) => this.afterSaveRecord());
    }

  }

  public afterSaveRecord() {
    this.addRecord.emit();
    this.passwordManagerService.addRecord();
    this.initForm();
    this.showSelect = false;
    this.clearClient();
    this.submitted = false;
    this.opened = false;

  }

  checkLinks() {
    return (this.type === 4 || this.type === 7) ? this.userDevice.length === 0 : false;
  }

  checkSsid() {
      return (this.type === 8 && (this.createPasswordRecord.value.ssid === 0 || !this.createPasswordRecord.value.ssid))
  }

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

  changeSelectedUserAndDevices(newItem, index?, type?) {
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

  private pushItemToUserDevice( newItem, type) {
    if (type === 'device') {
      this.userDevice.push({deviceId: newItem.id})
    } else if (type === 'user'){
      this.userDevice.push({userId: newItem.id})
    } else {
      this.userDevice.push({gadgetId: newItem.id})
    }
  }

  private filterUserDevice(newItem, type) {
    if (type === 'device') {
      return this.userDevice.filter((item) => item.deviceId !== newItem.id);
    } else if (type === 'user'){
      return this.userDevice.filter((item) => item.userId !== newItem.id);
    } else {
      return this.userDevice.filter((item) => item.gadgetId !== newItem.id);
    }
  }

   private findItemInUserDevice(newItem, type) {
    if (type === 'device') {
      return this.userDevice.filter((item) => item.deviceId === newItem.id);
    } else if (type === 'user'){
      return this.userDevice.filter((item) => item.userId === newItem.id);
    } else {
      return this.userDevice.filter((item) => item.gadgetId === newItem.id);
    }
  }

  public getCompanyDevices(companyId) {
    console.log('12351235');
    this.selectedClient = companyId.item;
    this.clearClient();
    // this.showClientType = false;
    companyId.item && this.getAllUsers(companyId.item.id);
    this.getGadgets();
    this.devicesService.getCompanyDevices(companyId.item.id).subscribe((res) => {
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

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => PASSWORD_RECORD_TYPES.sort().slice(0,9))
    );
  };

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

  searchClients = (text$: Observable<string>) => {
    console.log('1235123');
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickClients$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focusClients$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.clientsList
        : this.clientsList && this.clientsList
        .filter(v => v['name'].toLowerCase().indexOf(term.toLowerCase()) > -1)))
    );
  };

  formatter = (result: string) => {
    return result['TITLE'];
  };

  formatterClients = (result: string) => {
    return result['name'];
  };

  public getCLientsList() {
    this.companiesService.getCompaniesList().subscribe((res: any) => {
      this.clientsList = res
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((item) => !item.deletedAt)
    })
  }

  public showSelectWrapper($event) {
    console.log('123412');
    this.showSelect = !this.showSelect;
    console.log(this.showSelect, 'this.showSelect');
    this.stopEvent($event);
  }

  get ShowSelectStatus() {
    return this.showSelect;
  }

  public hideSelectWrapper() {
    this.showSelect = false;
    this.showGadgetsForm = false;
  }

  public setCurrentTab($event, item) {
    this.stopEvent($event);
    this.currentTab = item;
    this.showGadgetsForm = false;
  }

  private getAllUsers(companyId) {
    this.userService.getAllusers().subscribe((res: any) => {
      res = res.filter((item) =>  item.company.id == companyId && !item.deletedAt);
      this.usersList = [...(res.filter((item) => item.accountType === USER.TYPE.CLIENT))];
      this.usersCheckbox = new Array(this.usersList.length);
      console.log(this.usersList);
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

  public addGadgetsform() {
    const clientCompanyId = this.createPasswordRecord.value.client.id;
    const name = this.newGadgets;
    this.gadgetsService.addNewGadget(clientCompanyId, name).subscribe((res) => {
      this.gadgets.push(res);
      this.showGadgetsForm = false;
      // this.gadgetCheckbox = new Array(this.gadgets.length);
      // for (var i = 0; i < this.gadgetCheckbox.length; ++i) { this.gadgetCheckbox[i] = false; }
    })
  }

  public showGadgetsAddForm($event) {
    this.stopEvent($event);
    this.showGadgetsForm = !this.showGadgetsForm;
  }

  public getGadgets() {
    this.gadgetsService.getCompanyDevices().subscribe((res: any) => {
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

  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  public deleteGadget($event, id) {
    this.stopEvent($event);
    this.gadgetsService.deleteGadget(id)
      .subscribe((res: any) => this.gadgets = this.gadgets.filter((item) => item.id !== id))
  }

  public changeChecked(type, i) {
    if (type === 'user') {
      this.usersCheckbox[i] = !this.usersCheckbox[i];
    } else if (type === 'device') {
      this.deviceCheckbox[i] = !this.deviceCheckbox[i];
    } else {
      this.gadgetCheckbox[i] = !this.gadgetCheckbox[i];
    }
  }

  public getHistoryDate(date) {
    return moment(date).format('DD MMMM, YYYY')
  }

  public getEditTemplate(template) {
    const index  = PASSWORD_RECORD_TYPES.findIndex((item) => item.UPPERCASE === template);
    this.currentType = PASSWORD_RECORD_TYPES[index];
    this.changeType(this.currentType);
    return PASSWORD_RECORD_TYPES[index];
  }

  public getEditCompany(id) {
    if (this.clientsList) {
      const company = this.clientsList.filter((item) => item.id === id);
      this.getCompanyDevices({item: company[0]});
      this.selectedClient = company[0];
    }
  }

  public getStartDate(date) {
    const dateTime = moment(date);
    return ({
      month: parseInt(dateTime.format('M')),
      year: parseInt(dateTime.format('YYYY')),
      day: parseInt(dateTime.format('D'))
    });
  }

  deleteRecord(recordId){
    this.passwordManagerService.deleteRecordFromEditForm(recordId);
    this.hideAddForm();
  }

}
