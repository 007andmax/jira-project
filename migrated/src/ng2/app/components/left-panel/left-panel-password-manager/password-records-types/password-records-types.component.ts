import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { PASSWORD_RECORD_TYPES } from "../../../../const/password-record-types";
import { PasswordManagerService } from "../../../../services/password-manager/password-manager.service";
import {ApiPasswordManagerService} from "../../../../services/password-manager/api-password-manager.service";

/**
 * Password records types component
 */
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

  /**
   * Creates an instance of the LeftPanelComponent with the injected services
   * @param {PasswordManagerService} passwordManagerService Service to work with password manager
   * @param {ApiPasswordManagerService} apiPasswordManagerService Service to work with password manager api
   */
  constructor(
    private passwordManagerService: PasswordManagerService,
    private apiPasswordManagerService: ApiPasswordManagerService
  ) { }

  /**
   * Initializes password records types. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.startComponent();
    this.passwordManagerService.mobileCategory.subscribe(() => {
      this.filterByPasswordTypes(this.selectedCategory, this.selectedIndex);
    })
  }

  /**
   * Component init
   */
  public startComponent() {
    this.initializePasswordRecordTypes();
    this.setCountRecordsData();
  }

  /**
   * Filter by password types
   * * @param type - category
   * * @param index - index
   */
  public filterByPasswordTypes(type,index) {
    this.selectedIndex = index;
    this.selectedCategory = type;
    this.passwordManagerService.setSelectedCategory(type);
  }

  /**
   * Filter by password types mobile version
   * * @param type - category
   * * @param index - index
   */
  public filterByPasswordTypesMob(type,index) {
    this.selectedIndex = index;
    this.selectedCategory = type;
  }

  /**
   * Init password records type
   */
  private initializePasswordRecordTypes() {
    this._passwordRecords && this.passwordRecordTypes.map((item) => {
      item['count'] = 0;
    })
  }

  /**
   * Get items count in categories
   * @param companyItem - company
   */
  public getItemCountsInCategories(companyItem) {
    this.passwordRecordTypes.map((item) => {
      if (item.UPPERCASE.toLocaleLowerCase() === companyItem.template.toLowerCase()) item['count']++
    })
  }

  /**
   * Set records count in category
   */
  public setCountRecordsData() {
    return this._passwordRecords && this._passwordRecords.map((item) =>  this.getItemCountsInCategories(item));
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.apiPasswordManagerService.deleteSubscription();
  }

}
