import { Component, NgZone, OnInit } from '@angular/core';

import { ApiPasswordManagerService } from "./api-password-manager.service";
import { CompaniesService } from "../../services/company/companies.service";

@Component({
  selector: 'app-password-manager',
  templateUrl: './password-manager.component.html',
  styleUrls: ['./password-manager.component.scss']
})

export class PasswordManagerComponent implements OnInit {

  public recordsData: any;
  public companiesList: any;
  public filteredCompany: any;

  constructor(
    private ngZone: NgZone,
    private apiPasswordManagerService: ApiPasswordManagerService,
    private companiesService: CompaniesService
  ) {}

  ngOnInit() {
    this.getRecords();
    this.companiesService.filteredCompanyUpdate.subscribe((company) => {
      console.log('12351235');
      return this.filteredCompany = company;
    })

  };

  filterCompany() {
    return this.filteredCompany;
  }

  getRecords() {
     this.apiPasswordManagerService.getRecords().subscribe((res) => this.recordsData = res);
  }

}
