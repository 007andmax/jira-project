import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { USER } from "../../../const/users";
import { CompaniesService } from "../../../services/company/companies.service";
import { DevicesService } from "../../../services/devices/devices.service";
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { UsersService } from "../../../services/users/users.service";
import { ApiPasswordManagerService } from "../../../services/password-manager/api-password-manager.service";
import { GadgetsService } from "../../../services/gadgets/gadgets.service";
import { ISubscription } from "rxjs-compat/Subscription";

/**
 * Left panel password manager component
 */
@Component({
  selector: 'app-left-panel-password-manager',
  templateUrl: './left-panel-password-manager.component.html',
  styleUrls: ['./left-panel-password-manager.component.scss']
})
export class LeftPanelPasswordManagerComponent implements OnInit {

  public companiesList: any;
  public devicesAndUsersList = [];
  public company: any;
  public device: any;
  public selectedCompany: any;
  public selectedDeviceOrUser: any;
  public selectedDate: any;
  public selectedDateForFilter: any;
  public selectedDateItem: any;
  public passwordRecords: any;
  public passwordRecordsStart: any;
  public interval: any;
  private subGetRecords: ISubscription;
  private subNewRecordAdd: ISubscription;
  private subscriptions = new Subscription();
  public innerWidth: any;
  public clearCompanyItem = {
    companyId: '',
    name: ''
  };
  private subscription: ISubscription;

  /**
   * Creates an instance of the LeftPanelPasswordManagerComponent with the injected services
   * @param {CompaniesService} companiesService Service to work with companies
   * @param {DevicesService} devicesService Service to work with devices
   * @param {UsersService} userService Service to work with users
   * @param {PasswordManagerService} passwordManagerService Service to work with password manager
   * @param {ApiPasswordManagerService} apiPasswordManagerService Service to work with api password manager
   * @param {GadgetsService} gadgetsService Service to work with gadget
   * @param {ChangeDetectorRef} cdRef Service to work with change detection
   */
  constructor(
    private companiesService: CompaniesService,
    private devicesService: DevicesService,
    private userService: UsersService,
    private passwordManagerService: PasswordManagerService,
    private apiPasswordManagerService: ApiPasswordManagerService,
    private gadgetsService: GadgetsService,
    private cdRef:ChangeDetectorRef
  ) {
    this.getCompaniesList();
  }

  /**
   * Initializes left panel password manager. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getPasswordRecords();
    this.addNewRecord();
    this.deleteRecord();
    this.innerWidth = window.innerWidth;
  }

  /**
   * Get companies list
   */
  public getCompaniesList() {
    this.ngOnInit();
     return this.subscription = this.companiesService.clientsCompany
       .subscribe((company) => {
         if (!this.cdRef['destroyed']) {
           this.cdRef.detectChanges();
         }
         this.companiesList = this.getCompaniesNames(company);
       }
     );
  }

  /**
   * Select company filter
   */
  public selectCompany(item){
    this.selectedCompany = item.item;
    this.companiesService.setFilteredCompnay(item.item);
    this.passwordManagerService.setSelectedDeviceOrUser({});
    this.filterPasswordRecords(item.item);
    if (item.item.companyId) {
      this.getCompanyDevices(item.item.companyId);
      this.getAllUsers(item.item.companyId);
      this.getGadgets(item.item.companyId);
    }
  }

  /**
   * Select company mobile filter
   */
  public selectCompanyMob(item){
    this.selectedCompany = item.item;
    this.passwordManagerService.setSelectedDeviceOrUser({});
    if (item.item.companyId) {
      this.getCompanyDevices(item.item.companyId);
      this.getAllUsers(item.item.companyId);
      this.getGadgets(item.item.companyId);
    }
  }

  /**
   * Filter password records list
   * @param company - value for filter
   */
  public filterPasswordRecords(company) {
    if (company && company.companyId)
    return this.passwordRecords = this.passwordRecordsStart.filter((item) => item.companyId === company.companyId)
  };

  /**
   * Filter password records list by device or user
   * @param deviceOrUser - value for filter
   */
  public filterPasswordRecordsByDeviceOrUser(deviceOrUser) {
    return this.passwordRecords = this.passwordRecords.filter((item) => {
      const links = item.links.filter((item) => {
        if (item && deviceOrUser) {
          return (item.userId === deviceOrUser.id || item.deviceId === deviceOrUser.id)
        }
      });
      return links.length > 0;
    });
  }

  /**
   * Filter password records list by date
   * @param date - value for filter
   */
  public filterPasswordRecordsByDate(date) {
    const selectedDate = `${date.year}/${this.formatDayAndMonth(date.month)}/${this.formatDayAndMonth(date.day)}`;
    this.selectedDateItem = date;
    this.selectedDateForFilter = date;
    (this.selectedCompany && this.selectedCompany.companyId) && this.filterPasswordRecords(this.selectedCompany);
    return this.passwordRecords = this.passwordRecords.filter((item) => {
      return item.expiredDate === selectedDate;
    })
  }

  /**
   * Get formated date and month
   * @param item - value to format
   */
  public formatDayAndMonth(item) {
    return item < 10 ? `0${item}` : item;
  }

  /**
   * Select device or user
   * @param item - value to set
   */
  public selectDeviceOrUser(item) {
    this.selectedDeviceOrUser = item.item;
    this.passwordManagerService.setSelectedDeviceOrUser(item.item);
    this.filterPasswordRecordsByDeviceOrUser(item.item);
  }

  /**
   * Select device or user mobile version
   * @param item - value to set
   */
  public selectDeviceOrUserMob(item){
    this.selectedDeviceOrUser = item.item;
  }

  /**
   * Get device from company
   * @param companyId - id of company
   */
  public getCompanyDevices(companyId) {
    this.devicesService.getCompanyDevices(companyId).subscribe((res) => {
      if (res[this.selectedCompany.companyId]) {
        return this.devicesAndUsersList = [...this.devicesAndUsersList, ...res[this.selectedCompany.companyId]];
      }
    })
  }

  /**
   * select date
   * @param item - date to set
   */
  public selectDate(item) {
    this.passwordManagerService.setDate(item);
    this.filterPasswordRecordsByDate(item);
  }

  /**
   * select date mobile version
   * @param date - date to set
   */
  public selectDateMob(date) {
    this.selectedDateItem = date;
  }

  /**
  * Get password records list
  */
  public getPasswordRecords() {
    if (this.innerWidth <= 414) {
      this.passwordManagerService.setMobileCategory();
    }
    this.apiPasswordManagerService.getRecords();
    this.subGetRecords = this.apiPasswordManagerService.dataChange.subscribe((res: any) => {
      this.passwordRecordsStart = res;
      this.passwordRecords = res;
      this.selectedCompany && this.selectCompany({item: this.selectedCompany});
      this.selectedDeviceOrUser && this.selectDeviceOrUser({item: this.selectedDeviceOrUser});
      this.selectedDateItem && this.selectDate(this.selectedDateItem);
      if (this.innerWidth <= 414) {
        this.closeMobileFilters();
      }
    });
  }

  /**
   * Show category if has records
   */
  public showCategory() {
    return this.passwordRecords && this.passwordRecords.length > 0;
  }

  /**
   * Format output
   * @param result - bootstrap output format
   */
  public formatter = (result: string) => {
    return result['name'];
  };

  /**
   * Format device output
   * @param result - bootstrap output format
   */
  public formatterDevices = (result: string) => {
    if (result.hasOwnProperty('hostName')) {
      return result['hostName']
    } else {
      return (result['firstName'] + result['lastName'])
    }
  };

  /**
   * Search company
   * @param text$ - text to find
   */
  public search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(term => {
        return term.length < 1 ? []
          : this.companiesList.filter(item => {
            return item['name'].toLowerCase().indexOf(term.toLowerCase()) > -1
          }).slice(0, 10)
      }));
  };

  /**
   * Search device
   * @param text$ - text to find
   */
  public searchDevices = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(term => {
        return term.length < 1 ? []
          : this.devicesAndUsersList.filter(item => {
            return item && this.findUserOrDevice(item, term)
          }).slice(0, 10)
      }));
  };

  /**
   * Search find or user
   * @param item
   * @param term
   */
  private findUserOrDevice(item, term) {
    if (item.hasOwnProperty('hostName')) {
      return item['hostName'].toLowerCase().indexOf(term.toLowerCase()) > -1
    } else {
      return (item && item['firstName'] && item['firstName'].toLowerCase().indexOf(term.toLowerCase()) > -1)
        || (item && item['lastName'] && item['lastName'].toLowerCase().indexOf(term.toLowerCase()) > -1)
    }
  }

  /**
   * Get companies list
   * @param list
   */
  private getCompaniesNames(list) {
    const filteredArray = [];
    list.map((item) => {
      filteredArray.push({
        companyId: item.id,
        name: item.name
      })
    });
    return filteredArray;
  }

  /**
   * Clear company
   */
  clearCompany() {
    this.devicesAndUsersList = [];
    this.refreshCompany();
    this.refreshDeviceOrUser();
    this.getPasswordRecords();
  }

  /**
   * Clear company mobile version
   */
  clearCompanyMob() {
    this.devicesAndUsersList = [];
    this.company = null;
    this.selectedCompany = this.clearCompanyItem;
    this.clearDeviceMob();
  }

  /**
   * Clear device mobile version
   */
  clearDeviceMob() {
    this.device = null;
    this.selectedDeviceOrUser = null;
  }

  /**
   * Clear date mobile version
   */
  clearDateMob() {
    this.selectedDate = null;
    this.selectedDateItem = null;
  }

  /**
   * Clear device
   */
  clearDevice() {
    this.passwordRecords = this.passwordRecordsStart;
    this.refreshDeviceOrUser();
    this.filterPasswordRecords(this.selectedCompany);
  }

  /**
   * Clear date
   */
  clearDate($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.passwordManagerService.setDate('');
    this.selectedDate = null;
    this.selectedDateItem = null;
    this.getPasswordRecords();
  }

  /**
   * Clear device or user
   */
  private refreshDeviceOrUser() {
    this.device = null;
    this.selectDeviceOrUser({item: null});
  }

  /**
   * Clear company
   */
  private refreshCompany() {
    this.selectCompany({item: this.clearCompanyItem});
    this.company = null;
    this.device = null;
  }

  /**
   * Get all user by company
   * @param companyId - id of company
   */
  private getAllUsers(companyId) {
    this.userService.getAllusers().subscribe((res: any) => {
      res = res.filter((item) =>  item.company.id == companyId);
      this.devicesAndUsersList = [...(res.filter((item) => item.accountType === USER.TYPE.CLIENT)), ...this.devicesAndUsersList]
    })
  }

  /**
   * Get all gadgets by company
   * @param companyId - id of company
   */
  private getGadgets(companyId) {
    this.gadgetsService.getCompanyDevices().subscribe((res: any) =>
      this.devicesAndUsersList = [...(res.filter((item) => item.clientCompanyId === companyId)), ...this.devicesAndUsersList])
  }

  /**
   * Add new record
   */
  public addNewRecord() {
    this.subNewRecordAdd = this.passwordManagerService.newRecordsisAdd.subscribe(() => {
      if (this.innerWidth <= 414) {
        this.passwordManagerService.setMobileCategory();
      }
      this.subscriptions.add(this.apiPasswordManagerService.getRecordsNew().subscribe((res: any) => {
        this.passwordRecordsStart = res;
        this.passwordRecords = res;
        this.selectedCompany && this.selectCompany({item: this.selectedCompany});
        this.selectedDeviceOrUser && this.selectDeviceOrUser({item: this.selectedDeviceOrUser});
        this.selectedDateItem && this.selectDate(this.selectedDateItem);
        if (this.innerWidth <= 414) {
          this.closeMobileFilters();
        }
      }));
    })
  }

  /**
   * Delete record
   */
  public deleteRecord() {
    this.passwordManagerService.deleteItem.subscribe((item) => {
      if (this.innerWidth <= 414) {
        this.passwordManagerService.setMobileCategory();
      }
      this.subscriptions.add(this.apiPasswordManagerService.getRecordsNew().subscribe((res: any) => {
        this.passwordRecordsStart = res;
        this.passwordRecords = res;
        this.selectedCompany && this.selectCompany({item: this.selectedCompany});
        this.selectedDeviceOrUser && this.selectDeviceOrUser({item: this.selectedDeviceOrUser});
        this.selectedDateItem && this.selectDate(this.selectedDateItem);
        if (this.innerWidth <= 414) {
          this.closeMobileFilters();
        }
      }));
    });
  }

  /**
   * Getter for load status
   */
  get loadStatus () {
    return this.company && this.companiesList;
  }

  /**
   * Getter for companies
   */
  get companiesListStatus () {
    return this.companiesList;
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.apiPasswordManagerService.deleteSubscription();
    this.subscription && this.subscription.unsubscribe();
    this.subGetRecords && this.subGetRecords.unsubscribe();
    this.subGetRecords && this.subGetRecords.unsubscribe();
    this.subscriptions && this.subscriptions.unsubscribe();
  }

  /**
   * Close filter mobile version
   */
  public closeMobileFilters() {
    this.passwordManagerService.closeFilters();
  }

}
