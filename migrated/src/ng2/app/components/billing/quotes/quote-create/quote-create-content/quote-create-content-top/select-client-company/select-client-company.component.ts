import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { merge, Observable, Subject } from "rxjs";
import { CompaniesService } from "../../../../../../../services/company/companies.service";
import { ISubscription } from "rxjs/Subscription";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-select-client-company',
  templateUrl: './select-client-company.component.html',
  styleUrls: ['./select-client-company.component.scss']
})
export class SelectClientCompanyComponent implements OnInit {

  @ViewChild('instance') instance: NgbTypeahead;
  @Output() selectedItem = new EventEmitter<any>();
  @Input() formGroup: FormGroup;
  @Input() editItem: any;
  public selectedClient;
  public subGetCompaniesList: ISubscription;
  public clientsList: any;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(
    private companiesService: CompaniesService
  ) { }

  ngOnInit() {
    this.getCLientsList();
  }

  private getCLientsList() {
    this.subGetCompaniesList = this.companiesService.clientsCompany.subscribe((res: any) => {
      this.clientsList = res
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((item) => !item.deletedAt)
      if (this.editItem) {
        let index: number = this.clientsList.findIndex(item => item.id === this.editItem.id);
        if (index > (-1)) {
          this.selectedClient = this.clientsList[index];
          this.selectedItem.emit({ item: this.clientsList[index] });
        }

      }
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

  public selectItem(companyId) {
    this.selectedItem.emit(companyId);

  }

  formatter = (result: string) => {
    return result['name'];
  };

  public clearClient() {
    this.selectedItem.emit('null');
    this.selectedClient = null;
  }

}
