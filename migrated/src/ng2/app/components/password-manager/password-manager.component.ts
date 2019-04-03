import { Component, OnInit, ViewChild } from '@angular/core';
import { PasswordManagerTableComponent } from "./password-manager-table/password-manager-table.component";

import { ApiPasswordManagerService } from "./api-password-manager.service";
import { CompaniesService } from "../../services/company/companies.service";
import { PasswordManagerService } from "../../services/password-manager/password-manager.service";

/**
 * Password manager component
 */
@Component({
  selector: 'app-password-manager',
  templateUrl: './password-manager.component.html',
  styleUrls: ['./password-manager.component.scss']
})

export class PasswordManagerComponent implements OnInit {

  public companiesList: any;
  public selectedCompany: any;
  public selectedUserOrDevice: any;
  public selectedDate: any;
  public selectedCategory: any;
  @ViewChild(PasswordManagerTableComponent ) child: PasswordManagerTableComponent ;

  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
    private companiesService: CompaniesService,
    private passwordManagerService: PasswordManagerService
  ) {}

  ngOnInit() {
    this.getSelectCompany();
    this.getSelectedCategory();
    this.getSelectedDeviceOrUser();
    this.getSelectedDate();
  };

  /**
   * Get company list
   */
  public getSelectCompany() {
    this.companiesService.filteredCompanyUpdate.subscribe((company) => {
      this.refreshFilter();
      return this.selectedCompany = company;
    });
  }

  public getSelectedCategory() {
    this.passwordManagerService.emitSelectedCategory.subscribe((category) => {
      return this.selectedCategory = category
    });
  }

  public getSelectedDeviceOrUser() {
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

  public showDataTable() {
    return !!((this.selectedCompany && this.selectedCompany.companyId) || (this.selectedCategory));
  }

  formatDayAndMonth(item) {
    return item < 10 ? `0${item}` : item;
  }

  addRecord(event) {
    this.child.getSelectedCategory();
  }

  private refreshFilter() {
    this.selectedUserOrDevice = {};
    this.selectedDate = null;
  }



}
