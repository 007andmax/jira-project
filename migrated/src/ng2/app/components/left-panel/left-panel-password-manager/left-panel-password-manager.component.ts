import { Component, OnInit } from '@angular/core';
import { ApiPasswordManagerService } from '../../password-manager/api-password-manager.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CompaniesService } from "../../../services/company/companies.service";

@Component({
  selector: 'app-left-panel-password-manager',
  templateUrl: './left-panel-password-manager.component.html',
  styleUrls: ['./left-panel-password-manager.component.scss']
})
export class LeftPanelPasswordManagerComponent implements OnInit {

  public recordsData: any;
  public companiesList: any;
  public model: any;
  public selectedCompany: any;

  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
    private companiesService: CompaniesService
  ) { }

  ngOnInit() {
    this.getCompaniesList();
  }

  public getCompaniesList() {
     return this.companiesService.getCompaniesList().subscribe((company) => {
       this.companiesList = this.getCompaniesNames(company);
       console.log(this.companiesList, 'companiesList');
     });
  }

  private getCompaniesNames(list) {
    const filteredArray = [];
    list.map((item) => {
      filteredArray.push({
        companyId: item.id,
        name: item.name
      })
    });
    return filteredArray;
  }

  public selectedItem(item){
    this.selectedCompany = item.item;
    this.companiesService.setFilteredCompnay(item.item);
    console.log('testt');
  }

  formatter = (result: string) => {
    return result['name'];
  };

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(term => {
        return term.length < 1 ? []
          : this.companiesList.filter(item => {
            return item['name'].toLowerCase().indexOf(term.toLowerCase()) > -1
          }).slice(0, 10)
      }));
  }

}
