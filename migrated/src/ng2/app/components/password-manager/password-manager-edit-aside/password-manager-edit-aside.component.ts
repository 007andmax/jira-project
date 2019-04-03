import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

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
  @Output() addRecord = new EventEmitter<string>();
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  focusClients$ = new Subject<string>();
  clickClients$ = new Subject<string>();
  public submitted = false;
  public clientsList: any;
  public type: any;
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
    this.initForm();
    this.createPasswordRecord.reset();
    this.getCLientsList();
    this.type = 0;
    this.currentType = PASSWORD_RECORD_TYPES[0];
  }

  public opened: boolean = false;

  public _toggleSidebar() {
    this.createPasswordRecord.reset();
    this.submitted = false;
    this.opened = !this.opened;
    this.showSelect = false;
  }

  public showAddForm() {
    this.passwordManagerService.showAddForm.subscribe((res) => {
      this.opened = true;
    })
  }

  public changeType(event) {
    if (event) {
      this.type = PASSWORD_RECORD_TYPES_ENUM[event.UPPERCASE];
    }
  }

  get form() { return this.createPasswordRecord.controls; }

  public initForm(){
    this.createPasswordRecord = this.fb.group({
      description: ['', Validators.maxLength(5000)],
      client: ['', [Validators.required]],
      type: ['', [Validators.required]],
      ssid: [''],
      userName: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
      key: ['', [Validators.maxLength(100)]],
      link: [''],
      url: ['', [Validators.maxLength(255)]],
      code: [''],
      userOrDevice: [''],
      ipAdres: [''],
      port: [''],
      expiryDate: [''],
      note: ['', [Validators.maxLength(1000)]],
    });
  }

  public save() {

    this.submitted = true;
    const controls = this.createPasswordRecord.controls;
    const isUserRequired = this.checkLinks();
    const isSsidRequired = this.checkSsid();
    if (this.type === 8) {
      this.createPasswordRecord.controls['userName'].setValue('');
    }

    console.log(this.createPasswordRecord, 'this.createPasswordRecord');
    if (this.createPasswordRecord.invalid || isUserRequired || isSsidRequired) {
      return this.submitted;
    }
    this.createPasswordRecord.controls['userOrDevice'].setValue(this.userDevice);

    this.passwordManagerService.saveRecord(this.createPasswordRecord.value).subscribe((res) => {
      this.addRecord.emit();
      this.createPasswordRecord.reset();
      this.submitted = false;
      this.opened = false;
      this.showSelect = false;
    });
  }

  checkLinks() {
    if (this.type === 4 || this.type === 7) {
      return this.userDevice.length === 0;
    } else {
      return false;
    }
  }

  checkSsid() {
    console.log(this.type, 'this.type');
    console.log(this.createPasswordRecord.value.ssid, 'this.createPasswordRecord.value.ssid');
      return (this.type === 8 && (this.createPasswordRecord.value.ssid === 0 || !this.createPasswordRecord.value.ssid))
  }

  public toggleItem($event, newItem, type) {
    $event.preventDefault();
    $event.stopPropagation();
    const isItem = this.userDevice && this.findItemInUserDevice(newItem, type);
    if (!isItem || isItem.length === 0) {
      this.pushItemToUserDevice(newItem, type);
    } else {
      this.userDevice = this.filterUserDevice(newItem, type)
    }
  }

  pushItemToUserDevice( newItem, type) {
    if (type === 'device') {
      this.userDevice.push({deviceId: newItem.id})
    } else if (type === 'user'){
      this.userDevice.push({userId: newItem.id})
    }
  }

  filterUserDevice(newItem, type) {
    if (type === 'device') {
      return this.userDevice.filter((item) => item.deviceId !== newItem.id);
    } else if (type === 'user'){
      return this.userDevice.filter((item) => item.userId !== newItem.id);
    }
  }

  findItemInUserDevice(newItem, type) {
    if (type === 'device') {
      return this.userDevice.filter((item) => item.deviceId === newItem.id);
    } else if (type === 'user'){
      return this.userDevice.filter((item) => item.userId === newItem.id);
    }
  }

  public getCompanyDevices(companyId) {
    this.getAllUsers(companyId.item.id);
    this.getGadgets();
    this.devicesService.getCompanyDevices(companyId.item.id).subscribe((res) => {
      if (res[companyId.item.id]) {
        return this.devicesList = [...res[companyId.item.id]];
      }
    })
  }

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => PASSWORD_RECORD_TYPES)
    );
  };

  searchClients = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickClients$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focusClients$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.clientsList
        : this.clientsList && this.clientsList.filter(v => v['name'].toLowerCase().indexOf(term.toLowerCase()) > -1)))
    );
  };

  formatter = (result: string) => {
    return result['TITLE'];
  };

  formatterClients = (result: string) => {
    return result['name'];
  };

  public getCLientsList() {
    this.companiesService.getCompaniesList().subscribe((res) => {
      this.clientsList = res
    })
  }

  public showSelectWrapper() {
    this.showSelect = !this.showSelect;
  }

  public setCurrentTab($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this.currentTab = item;
  }

  private getAllUsers(companyId) {
    this.userService.getAllusers().subscribe((res: any) => {
      res = res.filter((item) =>  item.company.id == companyId);
      this.usersList = [...(res.filter((item) => item.accountType === USER.TYPE.CLIENT))]
    })
  }

  public addGadgetsform() {
    const clientCompanyId = this.createPasswordRecord.value.type.id;
    const name = this.newGadgets;
    this.gadgetsService.addNewGadget(clientCompanyId, name).subscribe((res) => {
      this.gadgets.push(res);
    })
  }

  public showGadgetsAddForm() {
    this.showGadgetsForm = !this.showGadgetsForm;
  }

  public getGadgets() {
    this.gadgetsService.getCompanyDevices().subscribe((res: any) =>
      this.gadgets = [...res]);
  }

}
