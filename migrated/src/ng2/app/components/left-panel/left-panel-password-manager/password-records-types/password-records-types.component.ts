import { Component, OnInit } from '@angular/core';

import { PASSWORD_RECORD_TYPES } from "../../../../const/password-record-types";
import { PasswordManagerService } from "../../../../services/password-manager/password-manager.service";
import {ApiPasswordManagerService} from "../../../password-manager/api-password-manager.service";

@Component({
  selector: 'app-password-records-types',
  templateUrl: './password-records-types.component.html',
  styleUrls: ['./password-records-types.component.scss']
})
export class PasswordRecordsTypesComponent implements OnInit {

  public passwordRecordsData: any;
  public passwordRecordTypes = PASSWORD_RECORD_TYPES;

  constructor(
    private passwordManagerService: PasswordManagerService,
    private apiPasswordManagerService: ApiPasswordManagerService
  ) { }

  ngOnInit() {
    this.initializePasswordRecordTypes();
    this.getPasswordRecords();
  }

  filterByPasswordTypes(type) {
    this.passwordManagerService.setFilteredType(type);
  }

  private initializePasswordRecordTypes() {
    this.passwordRecordTypes.map((item) => {
      item['count'] = 0;
    })
  }

  public getItemCountsInCategories(companyItem) {
    this.passwordRecordTypes.map((item) => {
      if (item.TITLE.toLocaleLowerCase() === companyItem.template.toLowerCase()) item['count']++
    })
  }

  public getPasswordRecords() {
    this.apiPasswordManagerService.getRecords().subscribe((res: any) => res.map((item) => {
      this.getItemCountsInCategories(item);
    }));
  }

}
