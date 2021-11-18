import { EventEmitter, Injectable } from '@angular/core';
import { CrmCompanyIndustry } from 'src/app/components/setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { CrmCompanyServiceType } from 'src/app/components/setting/crm-settings/crm-company-service-type/class/crm-company-service-type';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmRealTimeService } from 'src/app/states/crm/crm-real-time.service';


@Injectable({
  providedIn: 'root',
})
export class CrmStateService {
  industryForRemove;
  jobTitleForRemove;
  serviceTypeForRemove;
  jobTypeForRemove;
  listJobTypeForRemove = [];
  listIndustriesForRemove = [];
  listJobTitleForRemove = [];
  listServiceTypeForRemove = [];
  serviceTypeList: Array<CrmCompanyServiceType> = [];
  industryList: Array<CrmCompanyIndustry> = [];
  onGetIndustry: EventEmitter<any> = new EventEmitter();
  onGetServiceType: EventEmitter<any> = new EventEmitter();
  constructor(private crmService: CrmService,
    private crmRealTimeService: CrmRealTimeService) { }

  public onInit() {
    this.crmService.getIndustryList().subscribe((data: any) => {
      this.industryList = data.map(item => new CrmCompanyIndustry(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.onGetIndustry.emit(this.industryList);
    })

    this.crmRealTimeService.changeCrmArray.subscribe(data => {
      if (data.action === "INDUSTRY_SAVED") this.industryList.push(new CrmCompanyIndustry(data.data));
      if (data.action === "INDUSTRY_EDITED") {
        let index = this.industryList.findIndex(item => item.id === data.data.id);
        if (index > -1) this.industryList[index].onUpdate(data.data);
      }
      if (data.action === "INDUSTRY_REMOVED") {
        let index = this.industryList.findIndex(item => item.id === data.data);
        if (index > -1) this.industryList.splice(index, 1);
      }
      this.onGetIndustry.emit(this.industryList);
    })
  }
  public getServiceTypeList() {
    return this.serviceTypeList;
  }
  public onInitGetServiceTypeList() {
    this.crmService.getServiceTypeList().subscribe((data: any) => {
      console.log("data", data);
      this.serviceTypeList = data.map(item => new CrmCompanyServiceType(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.onGetServiceType.emit(data)
    })
    this.crmRealTimeService.changeCrmArray.subscribe(data => {
      if (data.action === "SERVICE_TYPE_SAVED") this.serviceTypeList.push(new CrmCompanyServiceType(data.data));
      if (data.action === "SERVICE_TYPE_EDITED") {
        let index = this.serviceTypeList.findIndex(item => item.id === data.data);
        if (index > -1) this.serviceTypeList[index].onUpdate(data.data);
      }
      if (data.action === "SERVICE_TYPE_REMOVED") {
        let index = this.serviceTypeList.findIndex(item => item.id === data.data);
        if (index > -1) this.serviceTypeList.splice(index, 1);
      }
      this.onGetServiceType.emit(data);
    })
  }
  public getIndustryList() {
    return this.industryList;
  }
  public getListJobTypeForRemove() {
    return this.listJobTypeForRemove;
  }
  public setListJobTypeForRemove(data) {
    this.listJobTypeForRemove = data;
  }
  public setJobTypeForRemove(data) {
    this.jobTypeForRemove = data;
  }
  public getJobTypeForRemove() {
    return this.jobTypeForRemove;
  }
  public getListServiceTypeForRemove() {
    return this.listServiceTypeForRemove;
  }
  public setListServiceTypeForRemove(data) {
    this.listServiceTypeForRemove = data;
  }
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
