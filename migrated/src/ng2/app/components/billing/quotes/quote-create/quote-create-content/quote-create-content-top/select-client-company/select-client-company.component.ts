import {Component, OnInit, ViewChild} from '@angular/core';
import {merge, Observable, Subject} from "rxjs";
import {CompaniesService} from "../../../../../../../services/company/companies.service";
import {ISubscription} from "rxjs/Subscription";
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs/operators";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-select-client-company',
  templateUrl: './select-client-company.component.html',
  styleUrls: ['./select-client-company.component.scss']
})
export class SelectClientCompanyComponent implements OnInit {

  @ViewChild('instance') instance: NgbTypeahead;
  public subGetCompaniesList: ISubscription;
  public clientsList: any;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(
    private companiesService: CompaniesService
  ) { }

  ngOnInit() {
    console.log('test');
    this.getCLientsList();
  }

  private getCLientsList() {
    console.log('1');
    this.subGetCompaniesList = this.companiesService.clientsCompany.subscribe((res: any) => {
      console.log(res, 'this.clientsLis');
      this.clientsList = res
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((item) => !item.deletedAt)

    })
  }

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.clientsList
        : this.clientsList && this.clientsList
        .filter(v => v['name'].toLowerCase().indexOf(term.toLowerCase()) > -1)))
    );
  };

  public getCompanyDevices(companyId) {
    console.log(companyId, 'companyId');
  }

  formatter = (result: string) => {
    return result['name'];
  };

}
