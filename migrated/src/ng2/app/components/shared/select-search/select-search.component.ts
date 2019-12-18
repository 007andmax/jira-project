import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { merge, Observable, Subject, Subscription } from "rxjs";

import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss']
})
export class SelectSearchComponent implements OnInit, OnDestroy {

  @Input() field: string = null;
  @Input() add: boolean = false;
  @Input() class: string = null;
  @Input() editItem: any = null;
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

  ) { }

  /**
   * Initializes select client. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {

  }
  ngDoCheck() {
    if (this.editItem) this.selectedItem = (this.field) ? this.editItem : this.editItem;

  }

  onChange(event) {
    let index = this.list.findIndex(item => (this.field) ? item[this.field] === this.selectedItem : item === this.selectedItem);
    if (index === -1) this.onSelectedItem.emit(this.selectedItem);
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
    //   this.editItem = null;
    this.selectedItem = null;
  }


  ngOnDestroy(): void {
    this.sub.unsubscribe();

  }

}
