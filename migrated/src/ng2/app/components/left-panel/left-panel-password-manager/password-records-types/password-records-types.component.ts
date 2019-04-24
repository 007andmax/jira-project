import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { PASSWORD_RECORD_TYPES } from "../../../../const/password-record-types";
import { PasswordManagerService } from "../../../../services/password-manager/password-manager.service";
import {ApiPasswordManagerService} from "../../../../services/password-manager/api-password-manager.service";

@Component({
  selector: 'app-password-records-types',
  templateUrl: './password-records-types.component.html',
  styleUrls: ['./password-records-types.component.scss']
})
export class PasswordRecordsTypesComponent implements OnInit {


  @Input() set passwordRecords(value: string) {
    this._passwordRecords = value;
    this.startComponent();
  }

  public passwordRecordTypes = PASSWORD_RECORD_TYPES;
  public selectedIndex = null;
  public _passwordRecords: any;
  public selectedCategory = {
    TITLE: '',
    UPPERCASE: ''
  };

  constructor(
    private passwordManagerService: PasswordManagerService,
    private apiPasswordManagerService: ApiPasswordManagerService
  ) { }

  ngOnInit() {
    this.startComponent();
    this.passwordManagerService.mobileCategory.subscribe(() => {
      this.filterByPasswordTypes(this.selectedCategory, this.selectedIndex);
    })
  }

  public startComponent() {
    this.initializePasswordRecordTypes();
    this.setCountRecordsData();
  }

  filterByPasswordTypes(type,index) {
    this.selectedIndex = index;
    this.selectedCategory = type;
    this.passwordManagerService.setSelectedCategory(type);
  }

  filterByPasswordTypesMob(type,index) {
    this.selectedIndex = index;
    this.selectedCategory = type;
    console.log(type, index, '§2');
  }



  private initializePasswordRecordTypes() {
    this._passwordRecords && this.passwordRecordTypes.map((item) => {
      item['count'] = 0;
    })
  }

  public getItemCountsInCategories(companyItem) {
    this.passwordRecordTypes.map((item) => {
      if (item.UPPERCASE.toLocaleLowerCase() === companyItem.template.toLowerCase()) item['count']++
    })
  }

  public setCountRecordsData() {
    return this._passwordRecords && this._passwordRecords.map((item) =>  this.getItemCountsInCategories(item));
  }

  ngOnDestroy() {
    this.apiPasswordManagerService.deleteSubscription();
  }

}
