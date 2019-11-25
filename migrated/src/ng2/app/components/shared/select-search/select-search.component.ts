import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy, OnChanges, ElementRef } from '@angular/core';
import { merge, Observable, Subject, Subscription } from "rxjs";
import { CompaniesService } from "../../../services/company/companies.service";
import { ISubscription } from "rxjs/Subscription";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from "@angular/forms";
 
import { RecurringTicketsStateService } from 'src/ng2/app/components/tickets/recurring-tickets/services/recurring-tickets-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { SelectClientCompanyStateService } from '../select-client-company/services/select-client-company-state.service';


@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss']
})
export class SelectSearchComponent implements OnInit, OnDestroy {

  @Input() field: string = null;
  @Input() list = [];
  @ViewChild('instance') instance: NgbTypeahead;
  @Output() onSelectedItem = new EventEmitter<any>();
  @Input() valid: boolean = true;
  @Input() filter: boolean = false;
  public selectedItem;
   
   
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  sub = new Subscription();

  /**
   *Creates an instance of the SelectClientCompanyComponent with the injected services
   * @param {CompaniesService} companiesService to work with companiies
   * @param {SelectClientCompanyStateService} companiesState to work with companiies state
   */
  constructor(
    private companiesService: CompaniesService,
    private companiesSelectState: SelectClientCompanyStateService,
    private companiesState:CompaniesStateService
  ) { }

  /**
   * Initializes select client. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
  
  }
 
 

  
  /**
   * boootstrap search method
   * @param text$
   */
  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.list
        : this.list && this.list
          .filter(v => (this.field ? v[this.field].toLowerCase().indexOf(term.toLowerCase()) > -1 : v.toLowerCase().indexOf(term.toLowerCase()) > -1))))
    );
  };

  /**
   * set selected item
   * @param companyId - id of company
   */
  public selectItem(item) {
    this.onSelectedItem.emit(item.item);

  }

  /**
   * formatter for bootstrap result
   * @param result
   */
  formatter = (result: string) => {
    
    return (this.field) ? result[this.field] : result;
  };

  /**
   * clear client input
   */
  public clearClient() {
    this.onSelectedItem.emit(null);
    this.selectedItem = null;
  }


  ngOnDestroy(): void {
    this.sub.unsubscribe();
   
  }

}
