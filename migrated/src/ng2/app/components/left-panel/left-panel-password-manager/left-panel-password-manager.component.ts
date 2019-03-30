import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { USER } from "../../../const/users";
import { CompaniesService } from "../../../services/company/companies.service";
import { DevicesService } from "../../../services/devices/devices.service";
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { UsersService } from "../../../services/users/users.service";


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
  public clearCompanyItem = {
    companyId: '',
    name: ''
  };

  constructor(
    private companiesService: CompaniesService,
    private devicesService: DevicesService,
    private userService: UsersService,
    private passwordManagerService: PasswordManagerService
  ) { }

  ngOnInit() {
    this.getCompaniesList();
  }

  public getCompaniesList() {
     return this.companiesService.getCompaniesList().subscribe((company) => {
       this.companiesList = this.getCompaniesNames(company);
     });
  }

  public selectCompany(item){
    this.selectedCompany = item.item;
    this.companiesService.setFilteredCompnay(item.item);
    this.passwordManagerService.setSelectedDeviceOrUser({});
    if (item.item.companyId) {
      this.getCompanyDevices(item.item.companyId);
      this.getAllUsers();
    }
  }

  public selectDeviceOrUser(item){
    this.selectedDeviceOrUser = item.item;
    this.passwordManagerService.setSelectedDeviceOrUser(item.item);
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
      return item['firstName'].toLowerCase().indexOf(term.toLowerCase()) > -1 || item['lastName'].toLowerCase().indexOf(term.toLowerCase()) > -1
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

  clearCompany(item) {
    console.log(item, item.length);
    if (item.length < 2) {
      console.log(1);
      this.selectCompany({item: this.clearCompanyItem});
      this.selectDeviceOrUser({item: null});
      this.device = null;
    }
  }

  clearDevice(item) {
    if (item.length === 0) {
      this.device = null;
    }
  }

  private getAllUsers() {
    this.userService.getAllusers().subscribe((res: any) => {
      this.devicesAndUsersList = [...(res.filter((item) => item.accountType === USER.TYPE.CLIENT)), ...this.devicesAndUsersList]
    })
  }

}
