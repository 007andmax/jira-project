import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

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
  public selectedDate: any;

  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
    private companiesService: CompaniesService,
    private passwordManagerService: PasswordManagerService
  ) {}

  ngOnInit() {
    this.getSelectCompany();
    this.getSelectPasswordRecordType();
    this.getSelectedDeviceOrUser();
    this.getSelectedDate();
  };

  public getSelectCompany() {
    this.companiesService.filteredCompanyUpdate.subscribe((company) => {
      this.filter = {
        type: 'companyId',
        value: company
      };
      this.refreshFilter();
      return this.filter;
    });
  }

  public getSelectPasswordRecordType(){
    this.passwordManagerService.filteredType.subscribe((type) => {
      this.filter = {
        type: 'template',
        value: type
      };
      this.refreshFilter();
      return this.filter;
    })
  }

  public getSelectedDeviceOrUser(){
    this.passwordManagerService.selectedDeviceOrUser.subscribe((type) =>
      this.selectedUserOrDevice = type
    )
  }

  public getSelectedDate() {
    this.passwordManagerService.selectedDate.subscribe((date) => {
      if (date) {
        this.selectedDate = `${date.year}/${this.formatDayAndMonth(date.month)}/${this.formatDayAndMonth(date.day)}`
      } else {
        this.selectedDate = null;
      }
    })
  }

  formatDayAndMonth(item) {
    return item < 10 ? `0${item}` : item;
  }

  private refreshFilter() {
    this.selectedUserOrDevice = {};
    this.selectedDate = null;
  }



}
