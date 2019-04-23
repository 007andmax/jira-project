import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Location } from "@angular/common";

import { USER } from "../../../const/users";
import { CompaniesService } from "../../../services/company/companies.service";
import { DevicesService } from "../../../services/devices/devices.service";
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { UsersService } from "../../../services/users/users.service";
import { ApiPasswordManagerService } from "../../../services/password-manager/api-password-manager.service";
import { GadgetsService } from "../../../services/gadgets/gadgets.service";
import { ISubscription } from "rxjs-compat/Subscription";
import { Router } from "@angular/router";


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
  public clearCompanyItem = {
    companyId: '',
    name: ''
  };
  public route: string;
  private subscription: ISubscription;

  constructor(
    private companiesService: CompaniesService,
    private devicesService: DevicesService,
    private userService: UsersService,
    private passwordManagerService: PasswordManagerService,
    private apiPasswordManagerService: ApiPasswordManagerService,
    private gadgetsService: GadgetsService,
    private cdRef:ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getCompaniesList();
    this.getPasswordRecords();
    this.addNewRecord();
    this.deleteRecord();
    this.getCompaniesList();
  }

  public getCompaniesList() {
     return this.subscription = this.companiesService.clientsCompany.subscribe((company) => {
       this.companiesList = this.getCompaniesNames(company);
       if (!this.cdRef['destroyed']) {
         this.cdRef.detectChanges();
       }
     });
  }

  public get checkCompaniesList() {
    return !this.companiesList;
  }

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

  public filterPasswordRecords(company) {
    if (company)
    return this.passwordRecords = this.passwordRecordsStart.filter((item) => item.companyId === company.companyId)
  };

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

  public filterPasswordRecordsByDate(date) {
    const selectedDate = `${date.year}/${this.formatDayAndMonth(date.month)}/${this.formatDayAndMonth(date.day)}`;
    this.selectedDateItem = date;
    this.selectedDateForFilter = date;
    (this.selectedCompany && this.selectedCompany.companyId) && this.filterPasswordRecords(this.selectedCompany);
    return this.passwordRecords = this.passwordRecords.filter((item) => {
      return item.expiredDate === selectedDate;
    })
  }

  formatDayAndMonth(item) {
    return item < 10 ? `0${item}` : item;
  }

  public selectDeviceOrUser(item) {
    this.selectedDeviceOrUser = item.item;
    this.passwordManagerService.setSelectedDeviceOrUser(item.item);
    this.filterPasswordRecordsByDeviceOrUser(item.item);
  }



  public getCompanyDevices(companyId) {
    this.devicesService.getCompanyDevices(companyId).subscribe((res) => {
      if (res[this.selectedCompany.companyId]) {
        return this.devicesAndUsersList = [...this.devicesAndUsersList, ...res[this.selectedCompany.companyId]];
      }
    })
  }

  public selectDate(item) {
    this.passwordManagerService.setDate(item);
    this.filterPasswordRecordsByDate(item);
  }

  public getPasswordRecords() {
    this.apiPasswordManagerService.getRecords();
    this.apiPasswordManagerService.dataChange.subscribe((res: any) => {
      this.passwordRecordsStart = res;
      this.passwordRecords = res;
      (this.selectedCompany && this.selectedCompany.companyId) && this.selectCompany({item: this.selectedCompany});
      this.selectedDeviceOrUser && this.selectDeviceOrUser({item: this.selectedDeviceOrUser});
      this.selectedDateItem && this.selectDate(this.selectedDateItem);
    });
  }

  public showCategory() {
    return this.passwordRecords && this.passwordRecords.length > 0;
  }

  formatter = (result: string) => {
    return result['name'];
  };

  formatterDevices = (result: string) => {
    if (result.hasOwnProperty('hostName')) {
      return result['hostName']
    } else {
      return (result['firstName'] + result['lastName'])
    }
  };

  search = (text$: Observable<string>) => {
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

  searchDevices = (text$: Observable<string>) => {
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

  private findUserOrDevice(item, term) {
    if (item.hasOwnProperty('hostName')) {
      return item['hostName'].toLowerCase().indexOf(term.toLowerCase()) > -1
    } else {
      return (item && item['firstName'] && item['firstName'].toLowerCase().indexOf(term.toLowerCase()) > -1)
        || (item && item['lastName'] && item['lastName'].toLowerCase().indexOf(term.toLowerCase()) > -1)
    }
  }

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

  clearCompany() {
    this.refreshCompany();
    this.refreshDeviceOrUser();
    this.getPasswordRecords();
  }

  clearDevice() {
    this.passwordRecords = this.passwordRecordsStart;
    this.refreshDeviceOrUser();
    this.filterPasswordRecords(this.selectedCompany);
  }

  clearDate($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.passwordManagerService.setDate('');
    this.selectedDate = null;
    this.selectedDateItem = null;
    this.getPasswordRecords();
  }


  private refreshDeviceOrUser() {
    this.device = null;
    this.selectDeviceOrUser({item: null});
  }

  private refreshDate() {
    this.selectedDate = null;
  }

  private refreshCompany() {
    this.selectCompany({item: this.clearCompanyItem});
    this.company = null;
    this.device = null;
  }

  private getAllUsers(companyId) {
    this.userService.getAllusers().subscribe((res: any) => {
      res = res.filter((item) =>  item.company.id == companyId);
      this.devicesAndUsersList = [...(res.filter((item) => item.accountType === USER.TYPE.CLIENT)), ...this.devicesAndUsersList]
    })
  }

  private getGadgets(companyId) {
    this.gadgetsService.getCompanyDevices().subscribe((res: any) =>
      this.devicesAndUsersList = [...(res.filter((item) => item.clientCompanyId === companyId)), ...this.devicesAndUsersList])
  }

  public addNewRecord() {
    this.passwordManagerService.showAddForm.subscribe(() => {
      this.getPasswordRecords();
    })
  }

  public deleteRecord() {
    this.passwordManagerService.deleteItem.subscribe((item) => {
      this.getPasswordRecords()
    });
  }

  public get loadStatus () {
    return this.company && this.companiesList;
  }

  public get companiesListStatus () {
    return this.companiesList;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
