import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { USER } from "../../../const/users";
import { CompaniesService } from "../../../services/company/companies.service";
import { DevicesService } from "../../../services/devices/devices.service";
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { UsersService } from "../../../services/users/users.service";
import { ApiPasswordManagerService } from "../../../services/password-manager/api-password-manager.service";
import { GadgetsService } from "../../../services/gadgets/gadgets.service";


@Component({
  selector: 'app-left-panel-password-manager',
  templateUrl: './left-panel-password-manager.component.html',
  styleUrls: ['./left-panel-password-manager.component.scss']
})
export class LeftPanelPasswordManagerComponent implements OnInit {

  public recordsData: any;
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
  public clearCompanyItem = {
    companyId: '',
    name: ''
  };

  constructor(
    private companiesService: CompaniesService,
    private devicesService: DevicesService,
    private userService: UsersService,
    private passwordManagerService: PasswordManagerService,
    private apiPasswordManagerService: ApiPasswordManagerService,
    private gadgetsService: GadgetsService
  ) { }

  ngOnInit() {
    console.log(1);
    this.getCompaniesList();
    this.getPasswordRecords();
    this.addNewRecord();
    this.deleteRecord();
  }

  public getCompaniesList() {
      console.log(2);
     return this.companiesService.getCompaniesList().subscribe((company) => {
       this.companiesList = this.getCompaniesNames(company);
     });
  }

  public selectCompany(item){
    console.log(3);
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
    console.log(4);
    if (company)
    return this.passwordRecords = this.passwordRecordsStart.filter((item) => item.companyId === company.companyId)
  };

  public filterPasswordRecordsByDeviceOrUser(deviceOrUser) {
    console.log(5);
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
    console.log(6);
    const selectedDate = `${date.year}/${this.formatDayAndMonth(date.month)}/${this.formatDayAndMonth(date.day)}`;
    this.selectedDateItem = date;
    this.selectedDateForFilter = date;
    this.passwordRecords = this.passwordRecordsStart;
    this.selectedCompany && this.filterPasswordRecords(this.selectedCompany);
    return this.passwordRecords = this.passwordRecords.filter((item) => {
      return item.expiredDate === selectedDate;
    })
  }

  formatDayAndMonth(item) {
    console.log(7);
    return item < 10 ? `0${item}` : item;
  }

  public selectDeviceOrUser(item) {
    console.log(8);
    this.selectedDeviceOrUser = item.item;
    this.passwordManagerService.setSelectedDeviceOrUser(item.item);
    this.filterPasswordRecordsByDeviceOrUser(item.item);
  }



  public getCompanyDevices(companyId) {
    console.log(9);
    this.devicesService.getCompanyDevices(companyId).subscribe((res) => {
      if (res[this.selectedCompany.companyId]) {
        return this.devicesAndUsersList = [...this.devicesAndUsersList, ...res[this.selectedCompany.companyId]];
      }
    })
  }

  public selectDate(item) {
    console.log(10);
    this.passwordManagerService.setDate(item);
    this.filterPasswordRecordsByDate(item);
  }

  public getPasswordRecords() {
    console.log(11);
    this.apiPasswordManagerService.getRecords().subscribe((res: any) => {
      this.passwordRecordsStart = res;
      this.passwordRecords = res;
      this.selectedCompany && this.selectCompany({item: this.selectedCompany});
      this.selectedDeviceOrUser && this.selectDeviceOrUser({item: this.selectedDeviceOrUser});
      this.selectedDateItem && this.selectedDate(this.selectedDateItem);
    });
  }

  public showCategory() {
    console.log(12);
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
    console.log(13);
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
    console.log(14);
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
    console.log(15);
    if (item.hasOwnProperty('hostName')) {
      return item['hostName'].toLowerCase().indexOf(term.toLowerCase()) > -1
    } else {
      return (item && item['firstName'] && item['firstName'].toLowerCase().indexOf(term.toLowerCase()) > -1)
        || (item && item['lastName'] && item['lastName'].toLowerCase().indexOf(term.toLowerCase()) > -1)
    }
  }

  private getCompaniesNames(list) {
    console.log(16);
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
    console.log(17);
    this.refreshCompany();
    this.refreshDeviceOrUser();
    this.refreshDate();
    this.passwordRecords = this.passwordRecordsStart;
  }

  clearDevice() {
    console.log(18);
    this.passwordRecords = this.passwordRecordsStart;
    this.refreshDeviceOrUser();
    this.filterPasswordRecords( this.selectedCompany);
  }

  clearDate($event) {
    console.log(19);
    $event.preventDefault();
    $event.stopPropagation();
    this.passwordManagerService.setDate('');
    this.passwordRecords = this.passwordRecordsStart;
    this.selectedDate = null;
    this.selectedCompany && this.selectCompany({item: this.selectedCompany});
    this.selectedDeviceOrUser && this.filterPasswordRecordsByDeviceOrUser({item :this.selectedDeviceOrUser});
  }


  private refreshDeviceOrUser() {
    console.log(20);
    this.device = null;
    this.selectDeviceOrUser({item: null});
  }

  private refreshDate() {
    console.log(21);
    this.selectedDate = null;
  }

  private refreshCompany() {
    console.log(22);
    this.selectCompany({item: this.clearCompanyItem});
    this.company = null;
    this.device = null;
  }

  private getAllUsers(companyId) {
    console.log(23);
    this.userService.getAllusers().subscribe((res: any) => {
      res = res.filter((item) =>  item.company.id == companyId);
      this.devicesAndUsersList = [...(res.filter((item) => item.accountType === USER.TYPE.CLIENT)), ...this.devicesAndUsersList]
    })
  }

  private getGadgets(companyId) {
    console.log(24);
    this.gadgetsService.getCompanyDevices().subscribe((res: any) =>
      this.devicesAndUsersList = [...(res.filter((item) => item.clientCompanyId === companyId)), ...this.devicesAndUsersList])
  }

  public addNewRecord() {
    console.log(25);
    this.passwordManagerService.showAddForm.subscribe(() => {
      this.getPasswordRecords();
    })
  }

  public deleteRecord() {
    console.log(26);
    this.passwordManagerService.deleteItem.subscribe((item) => {
      this.getPasswordRecords()
    });
  }

}
