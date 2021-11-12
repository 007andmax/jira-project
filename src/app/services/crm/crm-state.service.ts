import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CrmStateService {
  industryForRemove;
  jobTitleForRemove;
  serviceTypeForRemove;
  listIndustriesForRemove = [];
  listJobTitleForRemove = [];
  constructor() { }

  public getServiceTypeForRemove() {
    return this.serviceTypeForRemove;
  }
  public setServiceTypeForRemove(data) {
    this.serviceTypeForRemove = data;
  }
  public setListJobTitleForRemove(data) {
    this.listJobTitleForRemove = data;
  }
  public getListJobTitleForRemove() {
    return this.listJobTitleForRemove;
  }
  public setListIndustriesForRemove(data) {
    this.listIndustriesForRemove = data;
  }
  public getListIndustriesForRemove() {
    return this.listIndustriesForRemove;
  }
  public setIndustryForRemove(data) {
    this.industryForRemove = data;
  }
  public getIndustryForRemove() {
    return this.industryForRemove;
  }
  public getJobTitleForRemove() {
    return this.jobTitleForRemove;
  }
  public setJobTitleForRemove(data) {
    this.jobTitleForRemove = data;
  }
}
