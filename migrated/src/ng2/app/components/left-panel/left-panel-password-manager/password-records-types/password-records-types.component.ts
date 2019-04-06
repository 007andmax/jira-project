import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { PASSWORD_RECORD_TYPES } from "../../../../const/password-record-types";
import { PasswordManagerService } from "../../../../services/password-manager/password-manager.service";

@Component({
  selector: 'app-password-records-types',
  templateUrl: './password-records-types.component.html',
  styleUrls: ['./password-records-types.component.scss']
})
export class PasswordRecordsTypesComponent implements OnInit, OnChanges {

  @Input() passwordRecords: any;
  public passwordRecordTypes = PASSWORD_RECORD_TYPES;
  public selectedCategory = {
    TITLE: '',
    UPPERCASE: ''
  };

  constructor(
    private passwordManagerService: PasswordManagerService
  ) { }

  ngOnInit() {
    this.startComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    const name: SimpleChange = changes.passwordRecords;
    this.startComponent();
  }

  public startComponent() {
    this.initializePasswordRecordTypes();
    this.setCountRecordsData();
  }

  filterByPasswordTypes(type) {
    this.selectedCategory = type;
    this.passwordManagerService.setSelectedCategory(type);
  }

  private initializePasswordRecordTypes() {
    this.passwordRecords && this.passwordRecordTypes.map((item) => {
      item['count'] = 0;
    })
  }

  public getItemCountsInCategories(companyItem) {
    this.passwordRecordTypes.map((item) => {
      if (item.UPPERCASE.toLocaleLowerCase() === companyItem.template.toLowerCase()) item['count']++
    })
  }

  public setCountRecordsData() {
    return this.passwordRecords && this.passwordRecords.map((item) =>  this.getItemCountsInCategories(item));
  }

}
