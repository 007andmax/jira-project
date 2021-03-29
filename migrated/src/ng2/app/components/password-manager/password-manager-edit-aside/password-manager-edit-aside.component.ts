import { Component, EventEmitter, OnInit, Output, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Observable, Subject, merge, Subscription } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
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

import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { PasswordRecord } from '../class/password-record';
import { PasswordDeviceUser } from '../class/password-device-user';
import { PasswordRecordValidate } from '../class/password-record-validate';
import { Company } from 'src/ng2/app/interfaces/quote/company';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { PasswordManagerStateService } from 'src/ng2/app/states/password-manager/password-manager-state.service';
import { REMOVE_RECORD } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';

/**
 * Password manager edit aside component
 */
@Component({
  selector: 'app-password-manager-edit-aside',
  templateUrl: './password-manager-edit-aside.component.html',
  styleUrls: ['./password-manager-edit-aside.component.scss'],

})
export class PasswordManagerEditAsideComponent implements OnInit {

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

  public reqUsersList = [];
  public showGadgetsForm: any;
  public newGadgets: any;
  public gadgets: any;
  public userDevice = [];
  public usersCheckbox = [];
  public deviceCheckbox = [];
  public gadgetCheckbox = [];

  public selectedClient: any;
  public isEditmode = false;

  public expiryDate;
  public currentTypeChoosen: any;
  public subShowAddForm: Subscription;
  public subHideAddForm: Subscription;
  public subGetGadgets: ISubscription;
  // public subGetAllUsers: ISubscription;
  public subSaveEditRecord: ISubscription;
  public subSaveRecord: ISubscription;
  public subGetDevices: ISubscription;
  public subGetCompaniesList: ISubscription;
  public opened: boolean = false;

  isLoadPassword: boolean = false;



  tab: string = 'PASSWORD_DETAIL'
  PASSWORD_RECORD_TYPES = PASSWORD_RECORD_TYPES;
  selectedType = {
    TITLE: 'Office Account',
    UPPERCASE: 'OFFICE_365_ACCOUNT'
  }
  companies: Array<Company> = [];
  public editItem: PasswordRecord = null;
  showPassword: boolean = false;
  validate: PasswordRecordValidate = new PasswordRecordValidate();
  selectedUserAndDevices: Array<PasswordDeviceUser> = [];
  public devicesList = [];
  public usersList = [];
  public gadgetsList = [];
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
    private apiPasswordManagerService: ApiPasswordManagerService,
    public cd: ChangeDetectorRef,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private passwordManagerStateService: PasswordManagerStateService,
    private companiesState: CompaniesStateService,
    private devicesStateService: DevicesStateService,
    private usersStateService: UsersStateService,
    private elRef: ElementRef
  ) { }

  /**
   * Initializes Password manager edit aside. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.subShowAddForm = this.passwordManagerService.onEditForm.subscribe((res) => {
      this.editItem = new PasswordRecord(JSON.parse(JSON.stringify(res)));
      console.log("this.editItem", this.editItem);
      this.editItem.links.forEach(item => {
        if (item.userId) {
          this.selectedUserAndDevices.push(new PasswordDeviceUser(item.userId, `${item.userName}`, 'USER'));
          this.usersList.push(new PasswordDeviceUser(item.userId, `${item.userName}`, 'USER'));
        }
        if (item.deviceId) {
          this.selectedUserAndDevices.push(new PasswordDeviceUser(item.deviceId, `${item.deviceLabel}`, 'DEVICE'));
          this.devicesList.push(new PasswordDeviceUser(item.deviceId, `${item.deviceLabel}`, 'DEVICE'));
        }
        if (item.gadgetId) {
          this.selectedUserAndDevices.push(new PasswordDeviceUser(item.gadgetId, `${item.gadgetName}`, 'GADGET'));
          this.gadgetsList.push(new PasswordDeviceUser(item.gadgetId, `${item.gadgetName}`, 'GADGET'));
        }
      })
      this.selectedType = this.PASSWORD_RECORD_TYPES.find(item => item.UPPERCASE === this.editItem.template);
      this.selectedClient = this.companiesState.getCompanies().find(item => item.id === this.editItem.companyId);
      if (this.editItem) this.isEditmode = true;
      this.opened = true;
      // this.initForm();
    });
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_RECORD) {
          this.close();
        }

      }
    })
    //this.showAddForm();
    /*  this.getCLientsList();
      this.oGetUsers();
      //   this.oGetDevices();
      this.type = 0;
      this.currentType = PASSWORD_RECORD_TYPES[0];
      this.hideAddForm();
      this.initForm();*/
  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }

  selectCompany(data) {
    this.selectedClient = data;
    this.editItem.setCompanyId(data.id);
    this.validate.resetCompany();
  }
  selectType(data) {
    this.selectedType = data;
    this.editItem.setType(data.UPPERCASE);
    if (data.UPPERCASE !== 'DEVICE' && data.UPPERCASE !== 'LOCAL_USER_ACCOUNT') this.validate.resetLinkTo();
  }
  onChangeExpiryDate(data) {
    this.editItem.setExpiryDate(moment(new Date(data.year, data.month - 1, data.day)).format('YYYY/MM/DD'));
  }
  togglePassword() {
    if (!this.showPassword) {
      this.apiPasswordManagerService.setOpenRecord(this.editItem.id).subscribe((data: any) => {
        this.editItem.setPassword(data.password);
        this.showPassword = true;
      })
    } else {
      this.showPassword = false;
    }
  }
  copyPassword() {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = this.editItem.password;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }
    document.body.removeChild(textArea);
  }
  public save() {
    if (!this.validate.isValidateEdit(this.editItem, this.selectedUserAndDevices)) {
      console.log("this.validate", this.validate);
      return;
    }
    this.subSaveRecord = this.passwordManagerService.editRecord(this.editItem.getDataForEdit(this.selectedUserAndDevices))
      .subscribe((res) => {
        this.close();
      });
  }
  close() {
    this.opened = false;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  deleteRecord() {
    this.confirmStateService.setConfirmAction(REMOVE_RECORD);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Are you sure you want to delete “${this.editItem.username}” account?`;
    this.passwordManagerStateService.setRecordForRemove(this.editItem);
  }
  /**
   * toggle sidebar and refresh data
   */
  public _toggleSidebar() {
    this.submitted = false;
    this.showSelect = false;
    this.userDevice = [];
    //  this.initForm();
    this.clearClient();
    this.type = 0;
    this.currentTypeChoosen = PASSWORD_RECORD_TYPES[this.type];
    this.opened = !this.opened;
    if (!this.opened) {
      this.showPassword = false;
      this.elRef.nativeElement.querySelector('#toggle-password').classList.add('show-pass');
      this.elRef.nativeElement.querySelector('#toggle-password').classList.remove('hide-pass');
      this.elRef.nativeElement.querySelector('#password').setAttribute('type', 'password');

      this.passwordManagerService.setPassword(null);
    }
  }

  /**
   * show add form and init form
   */
  public showAddForm() {
    this.subShowAddForm = this.passwordManagerService.onEditForm.subscribe((res) => {
      this.editItem = res;
      this.selectedClient = this.companiesState.getCompanies().find(item => item.id === this.editItem.companyId);
      if (this.editItem) this.isEditmode = true;
      this.opened = true;
      this.initForm();
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
  public initForm() {

    /* this.expiryDate = this.editItem && this.editItem.expiredDate ? this.getStartDate(this.editItem.expiredDate) : null;
     this.createPasswordRecord = this.fb.group({
       description: [this.editItem ? this.editItem.description : '', Validators.maxLength(5000)],
       client: [this.editItem ? this.getEditCompany(this.editItem.companyId) : this.selectedClient, [Validators.required]],
       type: [this.editItem ? this.getEditTemplate(this.editItem.template) : PASSWORD_RECORD_TYPES[0], [Validators.required]],
       ssid: [this.editItem ? this.editItem.ssid : ''],
       userName: [this.editItem ? this.editItem.username : '', [Validators.required, Validators.maxLength(100)]],
       password: (this.editItem) ? [this.editItem.password] : ['', [Validators.required, Validators.maxLength(100)]],
       key: [this.editItem ? this.editItem.key : '', [Validators.maxLength(100)]],
       link: [''],
       url: [this.editItem ? this.editItem.url : '', [Validators.maxLength(255)]],
       code: [this.editItem ? this.editItem.code : ''],
       userOrDevice: [this.editItem ? this.editItem.links : ''],
       ipAdres: [this.editItem ? this.editItem.ip : '', [Validators.pattern('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]],
       port: [this.editItem ? this.editItem.port : ''],
       expiryDate: [this.editItem ? this.expiryDate : null, []],
       note: [this.editItem ? this.editItem.note : '', [Validators.maxLength(1000)]],
       https: [this.editItem ? this.editItem.https : false],
       ssh: [this.editItem ? this.editItem.ssh : false],
       telnet: [this.editItem ? this.editItem.telnet : false]
     });*/
  }

  /**
   * save new record
   */


  /**
   * run methods after record is saved
   */
  public afterSaveRecord() {
    this.addRecord.emit(true);
    // this.passwordManagerService.addRecord();
    //   this.initForm();
    this._toggleSidebar();

    /*this.showSelect = false;
    this.clearClient();
    this.submitted = false;
    this.type = 0;
    this.opened = false;*/
    this.cd.detectChanges();
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
  /*public toggleItem(newItem, type, index) {
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
  }*/

  /**
   * return form
   */
  get form() {
    return this.createPasswordRecord.controls;
  }

  /**
   * change selected user and device
   */
  /* public changeSelectedUserAndDevices(newItem, index?, type?) {
     const items = this.selectedUserAndDevices.filter((item) => {
       return (item.item.id !== newItem.id)
     });
     if (items.length < this.selectedUserAndDevices.length) {
       this.selectedUserAndDevices = items;
     } else {
       this.selectedUserAndDevices.push({
         item: newItem,
         index: index,
         type: type
       });
     }
 
   }*/

  /**
   * push item to user device
   * @param newItem - new item
   * @param type - type of new item
   */
  private pushItemToUserDevice(newItem, type) {
    if (type === 'device') {
      this.userDevice.push({ deviceId: newItem.id })
    } else if (type === 'user') {
      this.userDevice.push({ userId: newItem.id })
    } else {
      this.userDevice.push({ gadgetId: newItem.id })
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
    } else if (type === 'user') {
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
    } else if (type === 'user') {
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

    this.getGadgets();
    //  this.subGetDevices = this.devicesService.getCompanyDevices(companyId.item.id).subscribe((res) => {
    if (this.devicesStateService.getAllDevices() && this.devicesStateService.getAllDevices()[companyId.item.id]) {
      this.deviceCheckbox = new Array([...this.devicesStateService.getAllDevices()[companyId.item.id]].length);
      this.showGadgetsForm = false;
      for (var i = 0; i < this.deviceCheckbox.length; ++i) { this.deviceCheckbox[i] = false; }
      this.devicesList = [...this.devicesStateService.getAllDevices()[companyId.item.id]];
      this.devicesList.sort((a, b) => (a.hostName.toLowerCase() > b.hostName.toLowerCase()) ?
        1 : ((b.hostName.toLowerCase() > a.hostName.toLowerCase()) ? -1 : 0));
      if (this.isEditmode && this.editItem) {
        this.editItem.links.map((item) => {
          const index = this.devicesList.findIndex((deviceListItem) => {
            return deviceListItem.id === item.deviceId
          });
          if (index > -1) {
            // this.toggleItem(this.devicesList[index], 'device', index);
          }
        });
      }

    }
    companyId.item && this.getUsersCompany(companyId.item.id);
    //  });
    //   return this.selectedClient;
  }

  /**
   * search method for bootstrap select
   */
  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => PASSWORD_RECORD_TYPES.sort().slice(0, 9))
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
    if (this.companiesState.getCompanies().length > 0) this.clientsList = this.companiesState.getCompanies()
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((item) => !item.deletedAt)
    this.subGetCompaniesList = this.companiesState.getOnCompanies().subscribe((data) => {
      this.clientsList = data
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
    this.cd.detectChanges();
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
    this.cd.detectChanges();
  }

  /* public togglePassword() {
 
     if (!this.showPassword) {
       if (this.editItem) {
         this.isLoadPassword = true;
         this.apiPasswordManagerService.setOpenRecord(this.editItem.id).subscribe((data: any) => {
 
           this.passwordManagerService.setPassword(data.password);
 
           this.createPasswordRecord.controls['password'].setValue(data.password);
           this.showPassword = !this.showPassword;
           this.elRef.nativeElement.querySelector('#toggle-password').classList.add('hide-pass');
           this.elRef.nativeElement.querySelector('#toggle-password').classList.remove('show-pass');
           this.elRef.nativeElement.querySelector('#password').setAttribute('type', 'text');
 
           this.isLoadPassword = false;
           this.cd.detectChanges();
         })
       } else {
         this.showPassword = !this.showPassword;
         this.elRef.nativeElement.querySelector('#toggle-password').classList.add('hide-pass');
         this.elRef.nativeElement.querySelector('#toggle-password').classList.remove('show-pass');
         this.elRef.nativeElement.querySelector('#password').setAttribute('type', 'text');
 
       }
 
     } else {
       this.showPassword = !this.showPassword;
       this.elRef.nativeElement.querySelector('#toggle-password').classList.add('show-pass');
       this.elRef.nativeElement.querySelector('#toggle-password').classList.remove('hide-pass');
       this.elRef.nativeElement.querySelector('#password').setAttribute('type', 'password');
 
     }
   }*/

  /**
   * get all users
   */
  private getAllUsers(res) {

    this.reqUsersList = [...(res.filter((item) => item.accountType === USER.TYPE.CLIENT))];
    this.reqUsersList.sort((a, b) => (!a.firstName && !a.lastName || !b.firstName && !b.lastName || a.firstName.length === 0 && a.lastName.length === 0 || b.firstName.length === 0 && b.lastName.length === 0) ? -1 : (a.firstName.toLowerCase() > b.firstName.toLowerCase()) ?
      1 : ((b.firstName.toLowerCase() > a.firstName.toLowerCase()) ? -1 : 0));
  }

  private getUsersCompany(companyId) {

    let data = this.reqUsersList.filter((item) => item.company.id == companyId && !item.deletedAt);

    this.usersList = [...data];

    this.usersCheckbox = new Array(this.usersList.length);
    for (var i = 0; i < this.usersCheckbox.length; ++i) { this.usersCheckbox[i] = false; }
    if (this.isEditmode && this.editItem) {
      this.editItem.links.map((item) => {
        const index_res = this.reqUsersList.findIndex(userListItem => userListItem.id === item.userId);
        const index = this.usersList.findIndex(userListItem => userListItem.id === item.userId);
        if (index > -1 && index_res > -1) {
          //   this.toggleItem(this.usersList[index], 'user', index);
        } else if (index === -1 && index_res > -1) {
          // this.toggleItem(this.reqUsersList[index_res], 'user', index);
        }
      });
    }

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

  /* public oGetDevices() {
     if (this.devicesStateService.getAllDevices()) {
       this.getDevices(this.devicesStateService.getAllDevices());
     } else {
       this.devicesStateService.getOnDevices().subscribe((data) => {
 
         this.getDevices(data);
       })
     }
   }*/
  public oGetUsers() {
    if (this.usersStateService.getAllUsers().length > 0) this.getAllUsers(this.usersStateService.getAllUsers());
    this.usersStateService.getOnUsers().subscribe((data) => {

      this.getAllUsers(data);
    })

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
      /*  if (this.isEditmode && this.editItem) {
          this.editItem.links.map((item) => {
            const index = this.gadgets.findIndex((gadgetListItem) => {
              return gadgetListItem.id === item.gadgetId
            });
            if (index > -1) {
              this.toggleItem(this.gadgets[index], 'gadget', index);
            }
          });
        }*/
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
    const index = PASSWORD_RECORD_TYPES.findIndex((item) => item.UPPERCASE === template);
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
      this.getCompanyDevices({ item: company[0] });
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
   * Destroy password manager edit component
   */
  ngOnDestroy() {
    this.apiPasswordManagerService.deleteSubscription();
    this.subShowAddForm && this.subShowAddForm.unsubscribe();
    this.subHideAddForm && this.subHideAddForm.unsubscribe();
    this.subGetGadgets && this.subGetGadgets.unsubscribe();
    // this.subGetAllUsers && this.subGetAllUsers.unsubscribe();
    this.subSaveEditRecord && this.subSaveEditRecord.unsubscribe();
    this.subSaveRecord && this.subSaveRecord.unsubscribe();
    this.subGetDevices && this.subGetDevices.unsubscribe();
    this.subGetCompaniesList && this.subGetCompaniesList.unsubscribe();
  }

  public trackByIndex(index, item) {
    return index;
  }

  getUserAvatarUrl(user) {
    if (!(user && user.avatar)) return '';

    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) 0% 0% / cover no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) 0% 0% / cover no-repeat`;
    } else {
      return 'url(/users/default/image.jpg) 0% 0% / cover no-repeat';
    }
  };
  getUserById(userId) {
    return this.usersStateService.getAllUsers().find(item => item.id === userId);
  }
  getUserName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
  getNameForAvatar(user) {
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
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
