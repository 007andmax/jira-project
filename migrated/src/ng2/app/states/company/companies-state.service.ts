import { Injectable, EventEmitter } from '@angular/core';
import { CompaniesService } from '../../services/company/companies.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniesStateService {
allCompanies = [];
onGetCompanies: EventEmitter<any> = new EventEmitter();
  constructor(private companiesService: CompaniesService) { }
  public onInit() {
  this.companiesService.getCompaniesList().subscribe((data) => {
    this.setAllCompanies(data);
    this.onInitGetCompanies(data);
  })
  
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

}
