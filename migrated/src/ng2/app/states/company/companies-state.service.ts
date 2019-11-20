import { Injectable, EventEmitter } from '@angular/core';
import { CompaniesService } from '../../services/company/companies.service';
import { Company } from '../../interfaces/company/company';
import { CompanyProfile } from '../../components/companies/class/company-profile';
import { CompanyCalculateCount } from '../../components/companies/class/company-calculate-count';
import { CompaniesRealTimeService } from './companies-real-time.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniesStateService {
allCompanies = [];
onGetCompanies: EventEmitter<any> = new EventEmitter();
showAsideForAdd: EventEmitter<any> = new EventEmitter();
onShowArchived:EventEmitter<any> = new EventEmitter();
onEditCompany:EventEmitter<CompanyProfile> = new EventEmitter();
 companyForArchive:Company = null;
 onCalculateCount: EventEmitter<CompanyCalculateCount> = new EventEmitter();
 calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  constructor(private companiesService: CompaniesService,private companiesRealTimeService: CompaniesRealTimeService) { }
  public onInit() {
  this.companiesService.getCompaniesList().subscribe((data) => {
    this.setAllCompanies(data);
    this.onInitGetCompanies(data);
  })
  this.companiesRealTimeService.changeCompanyArray.subscribe(newChange => {
    console.log('newChange', newChange);
    if (newChange.action === 'COMPANY_SAVED') {
      console.log('++++++++++++++++++');
      const Index = this.allCompanies.findIndex((item) => item.id === newChange.data.id);
      if (Index > -1) this.allCompanies[Index] = newChange.data;
      
    }
  })
}
public getCalculateCount () {
  return this.calculateCount;
}
public getOnCalculateCount() {
  return this.onCalculateCount;
}
public setCalculateCount(data){
 this.calculateCount = data;
  this.onCalculateCount.emit(data);
}

public getOnEditCompany() {
  return this.onEditCompany;
}
public setEditCompany(data){
 
  this.onEditCompany.emit(data);
}
public setAllCompanies(data) {
  this.allCompanies = data;
}
public onInitGetCompanies(data) {
  this.onGetCompanies.emit(data);
}

public getOnCompanies() {
  return this.onGetCompanies;
}
public getCompanies() {
  return this.allCompanies;
}
public setCompnayForArchive (data) {
  this.companyForArchive = data;
}
public getCompanytForArchive () {
  return this.companyForArchive;
}
public getOnShowArchived () {
  return this.onShowArchived;
}
public setOnShowArchived (data) {
this.onShowArchived.emit(data);
}
public toggleAsideForAdd() {
  this.showAsideForAdd.emit();
}
public getShowAsideForAdd() {
  return this.showAsideForAdd;
}

}
