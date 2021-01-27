import { EventEmitter, Injectable } from '@angular/core';

import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

/**
 * Password manager service
 */
@Injectable({
  providedIn: 'root'
})
export class PasswordManagerService {

  private apiUrl = environment.apiUrl;
  public filteredType: EventEmitter<any> = new EventEmitter();
  public selectedDeviceOrUser: EventEmitter<any> = new EventEmitter();
  public selectedDate: EventEmitter<any> = new EventEmitter();
  public emitSelectedCategory: EventEmitter<any> = new EventEmitter();
  public showAddForm: EventEmitter<any> = new EventEmitter();
  public hideAddForm: EventEmitter<any> = new EventEmitter();
  public deleteItem: EventEmitter<any> = new EventEmitter();
  public deleteItemEditForm: EventEmitter<any> = new EventEmitter();
  public onToggleFilter: EventEmitter<any> = new EventEmitter();
  public mobileCategory: EventEmitter<any> = new EventEmitter();
  public newRecordsisAdd: EventEmitter<any> = new EventEmitter();
  public onSort: EventEmitter<any> = new EventEmitter();
  public onChangeRealTime: EventEmitter<any> = new EventEmitter();
  password: string = null;
  /**
   * Password manager service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient
  ) { }
  public getPassword() {
    return this.password;
  }
  public setPassword(password) {
    this.password = password;
  }
  public handleRealTimeChanges(data) {
    this.onChangeRealTime.emit(data)
  }

  public getOnSort() {
    return this.onSort;
  }

  public onInitSort(sort) {
    this.onSort.emit(sort)
  }

  /**
   * Set selected device or user
   * @param item - item to set
   */
  public setSelectedDeviceOrUser(item) {
    this.selectedDeviceOrUser.emit(item)
  }

  /**
   * Set selected category
   * @param item - item to set
   */
  public setSelectedCategory(item) {
    this.getSelectedCategory(item)
  }

  /**
   * Get selected category
   * @param item
   */
  public getSelectedCategory(item) {
    this.emitSelectedCategory.emit(item)
  }

  /**
   * Set date
   * @param item - date data
   */
  public setDate(item) {
    this.selectedDate.emit(item)
  }

  public onAddRecord(item?) {
    this.showAddForm.emit(item);
  }

  public onEditRecord(item?) {
    this.showAddForm.emit(item);
  }

  /**
   * Add new record
   * @param item - record data
   */

  public addRecord(item?) {

    this.showAddForm.emit(item);
    this.newRecordsisAdd.emit();
  }

  /**
   * Delete record
   * @param recordId - id of record
   */
  public deleteRecord(recordId) {
    this.deleteItem.emit(recordId);
    this.hideAddForm.emit();
  }

  /**
   * Delete record from edit form
   * @param recordId - id of record
   */
  public deleteRecordFromEditForm(recordId) {
    this.deleteItemEditForm.emit(recordId);
    //  this.hideAddForm.emit();
  }

  public getAgentsCredentialsForCompany(companyId) {
    return this.http.get(this.apiUrl + `passwordRecords/${companyId}/agents/password`);
  }

  /**
   * Save record
   * @param recordInfo - record data
   */
  public saveRecord(recordInfo) {
    const date = recordInfo.expiredDate;
    return this.http.post(this.apiUrl + 'passwordRecords', this.getData(recordInfo, false));
  }

  public createRecord(data) {
    return this.http.post(this.apiUrl + 'passwordRecords', data);
  }

  /**
   * Edit record
   * @param recordId - id of record
   * @param recordInfo - record data
   */
  public editRecord(recordInfo, recordId) {
    const date = recordInfo.expiredDate;
    return this.http.put(this.apiUrl + 'passwordRecords', Object.assign({ id: recordId }, this.getData(recordInfo, true)));
  }

  /**
   * Format day and mouth
   * @param item - date data
   */
  public formatDayAndMonth(item) {
    return item < 10 ? `0${item}` : item;
  }

  /**
   * Get formated date
   * @param date - date data
   */
  public getFormatedDate(date) {
    return date && `${date.year}/${this.formatDayAndMonth(date.month)}/${this.formatDayAndMonth(date.day)}`;
  }

  /**
   * Get data info
   * @param recordInfo - record information
   */
  public getData(recordInfo, edit) {
    if (recordInfo.type.UPPERCASE === 'OFFICE_365_ACCOUNT') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        description: recordInfo.description,
        expiredDate: this.getFormatedDate(recordInfo.expiryDate),
        key: recordInfo.key,
        links: recordInfo.userOrDevice,
        note: recordInfo.note,
        password: (edit && recordInfo.password === this.password) ? null : recordInfo.password,
        template: recordInfo.type.UPPERCASE,
        url: recordInfo.url,
        username: recordInfo.userName
      })
    } else if (recordInfo.type.UPPERCASE === 'MICROSOFT_ACCOUNT') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        description: recordInfo.description,
        expiredDate: this.getFormatedDate(recordInfo.expiryDate),
        password: (edit && recordInfo.password === this.password) ? null : recordInfo.password,
        links: recordInfo.userOrDevice,
        url: recordInfo.url,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        note: recordInfo.note

      })
    } else if (recordInfo.type.UPPERCASE === 'EMAIL_ACCOUNT') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        description: recordInfo.description,
        expiredDate: this.getFormatedDate(recordInfo.expiryDate),
        password: (edit && recordInfo.password === this.password) ? null : recordInfo.password,
        links: recordInfo.userOrDevice,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        note: recordInfo.note
      })
    } else if (recordInfo.type.UPPERCASE === 'HOSTING') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        description: recordInfo.description,
        expiredDate: this.getFormatedDate(recordInfo.expiryDate),
        password: (edit && recordInfo.password === this.password) ? null : recordInfo.password,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        note: recordInfo.note,
        url: recordInfo.url,
      })
    } else if (recordInfo.type.UPPERCASE === 'DEVICE') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        description: recordInfo.description,
        expiredDate: this.getFormatedDate(recordInfo.expiryDate),
        password: (edit && recordInfo.password === this.password) ? null : recordInfo.password,
        links: recordInfo.userOrDevice,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        note: recordInfo.note,
        ip: recordInfo.ipAdres ? recordInfo.ipAdres : null,
        https: !!recordInfo.https,
        ssh: !!recordInfo.ssh,
        telnet: !!recordInfo.telnet,
        port: recordInfo.port
      })
    } else if (recordInfo.type.UPPERCASE === 'GENERIC') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        description: recordInfo.description,
        expiredDate: this.getFormatedDate(recordInfo.expiryDate),
        password: (edit && recordInfo.password === this.password) ? null : recordInfo.password,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        note: recordInfo.note,
        code: recordInfo.code,
        links: recordInfo.userOrDevice,
      })
    } else if (recordInfo.type.UPPERCASE === 'AGENT') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        expiredDate: this.getFormatedDate(recordInfo.expiryDate),
        password: (edit && recordInfo.password === this.password) ? null : recordInfo.password,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        description: recordInfo.description
      })
    } else if (recordInfo.type.UPPERCASE === 'WIFI_NETWORK') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        expiredDate: this.getFormatedDate(recordInfo.expiryDate),
        links: recordInfo.userOrDevice,
        password: (edit && recordInfo.password === this.password) ? null : recordInfo.password,
        template: recordInfo.type.UPPERCASE,
        ssid: recordInfo.ssid,
        description: recordInfo.description,
        note: recordInfo.note
      })
    } else if (recordInfo.type.UPPERCASE === 'LOCAL_USER_ACCOUNT') {
      return ({

        companyId: recordInfo.client && recordInfo.client.id,
        expiredDate: this.getFormatedDate(recordInfo.expiryDate),
        password: (edit && recordInfo.password === this.password) ? null : recordInfo.password,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        links: recordInfo.userOrDevice,
        note: recordInfo.note,
        description: recordInfo.description,
      })
    }
  }

  /**
   * Close filters
   */
  public toggleFilters(val) {
    this.onToggleFilter.emit(val);
  }

  /**
   * Set mobile category
   */
  public setMobileCategory() {
    this.mobileCategory.emit();
  }

}
