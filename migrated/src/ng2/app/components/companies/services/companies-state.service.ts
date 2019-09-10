import { Injectable, EventEmitter } from '@angular/core';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniesStateService {
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
   
   
  constructor(private companiesService: CompaniesService) {
  
    this.companiesService.getCompaniesList();
  }
  
  public toggleAsideForAdd() {
    this.showAsideForAdd.emit();
  }
  public getShowAsideForAdd() {
    return this.showAsideForAdd;
  }

}
