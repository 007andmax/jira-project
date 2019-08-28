import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy, OnChanges, ElementRef } from '@angular/core';
import { merge, Observable, Subject, Subscription } from "rxjs";
import { CompaniesService } from "../../../services/company/companies.service";
import { ISubscription } from "rxjs/Subscription";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from "@angular/forms";
import { SelectClientCompanyStateService } from './services/select-client-company-state.service';
import { RecurringTicketsStateService } from 'src/ng2/app/components/tickets/recurring-tickets/services/recurring-tickets-state.service';

/**
 *  Select client component
 */
@Component({
  selector: 'app-select-client-company',
  templateUrl: './select-client-company.component.html',
  styleUrls: ['./select-client-company.component.scss']
})
export class SelectClientCompanyComponent implements OnInit, OnDestroy {



  @ViewChild('instance') instance: NgbTypeahead;
  @Output() selectedItem = new EventEmitter<any>();
  @Output() getAllItems = new EventEmitter<any>();
  @Input() valid: boolean = true;
  @Input() formGroup: FormGroup;
  @Input() editItem: any;
  @Input() filter: boolean = false;
  public selectedClient;
  public subGetCompaniesList: ISubscription;
  public clientsList: any;
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
    private companiesState: SelectClientCompanyStateService,
  ) { }

  /**
   * Initializes select client. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getCLientsList();
    this.onInitClearState();
    this.onCheckEditItem();


  }
 
/**
  * Subscribe for edit mode
  */
  private onCheckEditItem() {
    let getCompanyFromEdit = this.companiesState.getCompanyFromEdit().subscribe((data) => {
      this.editItem = data;
      let index: number = this.clientsList.findIndex(item => item.id === this.editItem.id);
      if (index > (-1)) {

        this.selectedClient = this.clientsList[index];
      }
    });
    this.sub.add(getCompanyFromEdit);
  }

  /**
  * Subscribe for clear data
  */
  private onInitClearState() {
    let getClearState = this.companiesState.getClearState().subscribe(() => this.clearClient());
    this.sub.add(getClearState);
  }

  /**
   * Get client list
   */
  private getCLientsList() {
    this.subGetCompaniesList = this.companiesService.clientsCompany.subscribe((res: any) => {
      this.clientsList = res
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((item) => !item.deletedAt)
      this.getAllItems.emit(this.clientsList);
      if (this.filter) {
        this.clientsList = this.clientsList
          .filter((item) => item.clientType !== 'VENDOR')
      }
      if (this.editItem) {
        let index: number = this.clientsList.findIndex(item => item.id === this.editItem.id);
        if (index > (-1)) {
          this.selectedClient = this.clientsList[index];
        }
      }
    })
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
      map(term => (term === '' ? this.clientsList
        : this.clientsList && this.clientsList
          .filter(v => v['name'].toLowerCase().indexOf(term.toLowerCase()) > -1)))
    );
  };

  /**
   * set selected item
   * @param companyId - id of company
   */
  public selectItem(companyId) {
    this.selectedItem.emit(companyId);

  }

  /**
   * formatter for bootstrap result
   * @param result
   */
  formatter = (result: string) => {
    return result['name'];
  };

  /**
   * clear client input
   */
  public clearClient() {
    this.selectedItem.emit('null');
    this.selectedClient = null;
  }


  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
