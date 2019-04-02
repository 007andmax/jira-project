import { Component, OnInit, ViewChild } from '@angular/core';
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
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  focusClients$ = new Subject<string>();
  clickClients$ = new Subject<string>();
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

  public _opened: boolean = false;

  public _toggleSidebar() {
    this.createPasswordRecord.reset();
    this._opened = !this._opened;
  }

  public showAddForm() {
    this.passwordManagerService.showAddForm.subscribe((res) => {
      this._opened = true;
    })
  }

  isFieldValid(field: string) {
    return !this.createPasswordRecord.get(field).valid && this.createPasswordRecord.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field)
    };
  }

  public changeType(event) {
    this.type = PASSWORD_RECORD_TYPES_ENUM[event.UPPERCASE];
  }

  public initForm(){
    this.createPasswordRecord = this.fb.group({
      description: ['', Validators.max(5000)],
      client: ['', [Validators.required]],
      type: ['', [Validators.required]],
      ssid: [''],
      userName: ['', [Validators.required, Validators.max(100)]],
      password: ['', [Validators.required, Validators.max(100)]],
      key: ['', [Validators.max(100)]],
      link: [''],
      url: ['', [Validators.max(255)]],
      code: [''],
      userOrDevice: [''],
      ipAdres: [''],
      port: [''],
      expiryDate: [''],
      note: ['', [Validators.max(1000)]],
    });
  }

  public save() {
    const controls = this.createPasswordRecord.controls;

    if (this.createPasswordRecord.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      // return;
    }
    this.passwordManagerService.saveRecord(this.createPasswordRecord.value).subscribe((res) => {
      console.log(res);
    });
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

  public setCurrentTab(item) {
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
