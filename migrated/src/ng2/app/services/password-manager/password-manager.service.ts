import { EventEmitter, Injectable } from '@angular/core';

import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

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

  constructor(
    private http: HttpClient
  ) { }

  setFilteredType(type) {
    this.filteredType.emit({
      template: type.TITLE
    });
  }

  setSelectedDeviceOrUser(item) {
    this.selectedDeviceOrUser.emit(item)
  }

  setSelectedCategory(item) {
    this.getSelectedCategory(item)
  }

  getSelectedCategory(item) {
    console.log(item, '1111');
    this.emitSelectedCategory.emit(item)
  }

  setDate(item) {
    this.selectedDate.emit(item)
  }

  addRecord() {
    this.showAddForm.emit(true);
  }

  saveRecord(recordInfo) {
    const date = recordInfo.expiredDate;
    recordInfo.expiredDate =  recordInfo.expiredDate ?
      `${date.year}/${this.formatDayAndMonth(date.month)}/${this.formatDayAndMonth(date.day)}` : '';
    return this.http.post(this.apiUrl + 'passwordRecords', this.getData(recordInfo));
  }

  formatDayAndMonth(item) {
    return item < 10 ? `0${item}` : item;
  }

  public getData(recordInfo) {
    console.log(recordInfo.type.UPPERCASE, 'recordInfo.type.title');

    if (recordInfo.type.UPPERCASE === 'OFFICE_365_ACCOUNT') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        description: recordInfo.description,
        expiredDate: recordInfo.expiryDate,
        key: recordInfo.description,
        links: [],
        note: recordInfo.note,
        password: recordInfo.password,
        template: recordInfo.type.UPPERCASE,
        url: recordInfo.url,
        username: recordInfo.userName
      })
    } else if (recordInfo.type.UPPERCASE === 'MICROSOFT_ACCOUNT') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        description: recordInfo.description,
        expiredDate: recordInfo.expiryDate,
        password: recordInfo.password,
        links: [],
        url: recordInfo.url,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        note: recordInfo.note

      })
    } else if (recordInfo.type.UPPERCASE === 'EMAIL_ACCOUNT') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        description: recordInfo.description,
        expiredDate: recordInfo.expiryDate,
        password: recordInfo.password,
        links: [],
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        note: recordInfo.note
      })
    } else if (recordInfo.type.UPPERCASE === 'HOSTING') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        description: recordInfo.description,
        expiredDate: recordInfo.expiryDate,
        password: recordInfo.password,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        note: recordInfo.note,
        url: recordInfo.url,
      })
    } else if (recordInfo.type.UPPERCASE === 'GENERIC') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        description: recordInfo.description,
        expiredDate: recordInfo.expiryDate,
        password: recordInfo.password,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        note: recordInfo.note,
        code: recordInfo.code,
        links: []
      })
    } else if (recordInfo.type.UPPERCASE === 'AGENT') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        expiredDate: recordInfo.expiryDate,
        password: recordInfo.password,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName
      })
    } else if (recordInfo.type.UPPERCASE === 'WIFI_NETWORK') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        expiredDate: recordInfo.expiryDate,
        links: [],
        password: recordInfo.password,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        description: recordInfo.description,
        note: recordInfo.note
      })
    } else if (recordInfo.type.UPPERCASE === 'LOCAL_USER_ACCOUNT') {
      return ({
        companyId: recordInfo.client && recordInfo.client.id,
        expiredDate: recordInfo.expiryDate,
        password: recordInfo.password,
        template: recordInfo.type.UPPERCASE,
        username: recordInfo.userName,
        links: [],
        note: recordInfo.note,
        ssid: recordInfo.ssid
      })
    }
  }



}
