import { Injectable, EventEmitter } from '@angular/core';
import { CompaniesService } from '../../services/company/companies.service';
import { Company } from '../../interfaces/company/company';
import { CompanyProfile } from '../../components/companies/class/company-profile';

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
  constructor(private companiesService: CompaniesService) { }
  public onInit() {
  this.companiesService.getCompaniesList().subscribe((data) => {
    this.setAllCompanies(data);
    this.onInitGetCompanies(data);
  })
  
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
