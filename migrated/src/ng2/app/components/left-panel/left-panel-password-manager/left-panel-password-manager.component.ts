import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { USER } from "../../../const/users";
import { ApiPasswordManagerService } from '../../password-manager/api-password-manager.service';
import { CompaniesService } from "../../../services/company/companies.service";
import { DevicesService } from "../../../services/devices/devices.service";
import { UsersService } from "../../../services/users/users.service";

@Component({
  selector: 'app-left-panel-password-manager',
  templateUrl: './left-panel-password-manager.component.html',
  styleUrls: ['./left-panel-password-manager.component.scss']
})
export class LeftPanelPasswordManagerComponent implements OnInit {

  public recordsData: any;
  public companiesList: any;
  public devicesList: any;
  public model: any;
  public device: any;
  public users: any;
  public selectedCompany: any;
  public selectedDevice: any;

  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
    private companiesService: CompaniesService,
    private devicesService: DevicesService,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.getCompaniesList();
  }

  public getCompaniesList() {
     return this.companiesService.getCompaniesList().subscribe((company) => {
       this.companiesList = this.getCompaniesNames(company);
     });
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

  getAllUsers() {
    this.userService.getAllusers().subscribe((res) => {
      console.log(res, 'RES');
      this.users = res.filter((item) => item.accountType === USER.TYPE.CLIENT);
    })
  }

  public selectCompany(item){
    this.selectedCompany = item.item;
    this.companiesService.setFilteredCompnay(item.item);
    this.getCompanyDevices(item.item.companyId);
    this.getAllUsers();
  }

  public selectDevice(item){
    this.selectedDevice = item.item;
  }

  public getCompanyDevices(companyId) {
    this.devicesService.getCompanyDevices(companyId).subscribe((res) => {
      return this.devicesList = res[this.selectedCompany.companyId];
    })
  }

  formatter = (result: string) => {
    return result['name'];
  };

  formatterDevices = (result: string) => {
    return result['hostName'];
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
  }

  searchDevices = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(term => {
        console.log(this.devicesList, 'this.devicesList');
        return term.length < 1 ? []
          : this.devicesList.filter(item => {
            return item['hostName'].toLowerCase().indexOf(term.toLowerCase()) > -1
          }).slice(0, 10)
      }));
  }

}
