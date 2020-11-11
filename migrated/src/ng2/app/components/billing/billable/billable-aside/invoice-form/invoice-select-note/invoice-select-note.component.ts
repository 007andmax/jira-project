import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { merge, Observable, Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
var $ = require("jquery");


@Component({
  selector: 'app-invoice-select-note',
  templateUrl: './invoice-select-note.component.html',
  styleUrls: ['./invoice-select-note.component.scss']
})
export class InvoiceSelectNoteComponent implements OnInit, OnDestroy {


  @Input() field: string = null;
   change: boolean = true;
  
  @Input() class: string = null;
  @Input() editItem: any = null;
  @Input() maxlength: number = null;
  @Input() placeholder: string = '';
  @Input() list = [];
  @Input() id: string = '';
  @ViewChild('instance') instance: NgbTypeahead;
  @Output() onSelectedItem = new EventEmitter<any>();
  @Output() onChangeInput = new EventEmitter<any>();
  @Output() onOpenDropDown = new EventEmitter<any>();
  @Output() onClosedDropDown = new EventEmitter<any>();
  @Input() valid: boolean = true;
  @Input() filter: boolean = false;
  public selectedItem;
  
  private isOpen:boolean = false;
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
    if (this.instance.isPopupOpen() && !this.isOpen) {
      this.isOpen = true;
       this.onOpenDropDown.emit(null);
    }
    if (!this.instance.isPopupOpen() && this.isOpen) {
      this.isOpen = false; 
      this.onClosedDropDown.emit(null);
    }   
  }
  
  onCheckChange(event) {
    this.onChangeInput.emit(event.target.value);
  }
  onChange(event) {
    if (!this.change) return;
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

  public isDropDownOpen() {
  
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
