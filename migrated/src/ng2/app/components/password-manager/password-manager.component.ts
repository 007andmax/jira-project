import { Component, OnInit } from '@angular/core';

import { ApiPasswordManagerService } from "./api-password-manager.service";
import { CompaniesService } from "../../services/company/companies.service";
import { PasswordManagerService } from "../../services/password-manager/password-manager.service";

@Component({
  selector: 'app-password-manager',
  templateUrl: './password-manager.component.html',
  styleUrls: ['./password-manager.component.scss']
})

export class PasswordManagerComponent implements OnInit {

  public companiesList: any;
  public filter: any;
  public selectedUserOrDevice: any;

  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
    private companiesService: CompaniesService,
    private passwordManagerService: PasswordManagerService
  ) {}

  ngOnInit() {
    this.getSelectCompany();
    this.getSelectPasswordRecordType();
    this.getSelectedDeviceOrUser();
  };

  public getSelectCompany() {
    this.companiesService.filteredCompanyUpdate.subscribe((company) => {
      this.filter = {
        type: 'companyId',
        value: company
      };
      this.refreshDeviceOrUser();
      return this.filter;
    });
  }

  public getSelectPasswordRecordType(){
    this.passwordManagerService.filteredType.subscribe((type) => {
      this.filter = {
        type: 'template',
        value: type
      };
      this.refreshDeviceOrUser();
      return this.filter;
    })
  }

  public getSelectedDeviceOrUser(){
    this.passwordManagerService.selectedDeviceOrUser.subscribe((type) => {
      return this.selectedUserOrDevice = type;
    })
  }

  refreshDeviceOrUser() {
    this.selectedUserOrDevice = {};
  }



}
