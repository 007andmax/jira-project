import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { merge, Observable, Subject, Subscription } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from "@angular/forms";
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { HOURS, MINUTES } from 'src/ng2/app/const/duration';
import { Duration } from './class/duration';
import { DurationStateService } from './services/duration-state.service';

@Component({
  selector: 'app-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.scss']
})
export class DurationComponent implements OnInit,OnDestroy {
  

  @ViewChild('instanceHours') instanceHours: NgbTypeahead;
  @ViewChild('instanceMin') instanceMin: NgbTypeahead;
  @Output() selectedDucation = new EventEmitter<any>();
  public selectedHours;
  public selectedMin;
  public subGetDevicesList: ISubscription;
  public hoursList: any = HOURS;
  public minList: any = MINUTES;
  duration:Duration = new Duration();
  focusHours$ = new Subject<string>();
  clickHours$ = new Subject<string>();
  focusMin$ = new Subject<string>();
  clickMin$ = new Subject<string>();
  sub = new Subscription();

  /**
   *Creates an instance of the SelectClientCompanyComponent with the injected services
   * @param {CompaniesService} companiesService to work with companiies
   */
  constructor(
    private durationState:DurationStateService
    
  ) { }

  /**
   * Initializes select client. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.onInitClearState();
  }

  private onInitClearState() {
    let getClearState = this.durationState.getClearState().subscribe(() => this.clearData());
    this.sub.add(getClearState);
   }
   
  /**
   * boootstrap search method
   * @param text$
   */
  searchHours = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickHours$.pipe(filter(() => !this.instanceHours.isPopupOpen()));
    const inputFocus$ = this.focusHours$;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.hoursList
        : this.hoursList && this.hoursList
          .filter(v => v['name'].toLowerCase().indexOf(term.toLowerCase()) > -1)))
    );
  };


  /**
   * boootstrap search method
   * @param text$
   */
  searchMin = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickMin$.pipe(filter(() => !this.instanceMin.isPopupOpen()));
    const inputFocus$ = this.focusMin$;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.minList
        : this.minList && this.minList
          .filter(v => v['name'].toLowerCase().indexOf(term.toLowerCase()) > -1)))
    );
  };
 
 

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
  public clearHours() {
    this.duration.setHours(null);
    this.selectedDucation.emit(this.duration);
    this.selectedHours = null;
  }

  /**
   * clear client input
   */
  public clearMin() {
    this.duration.setMinutes(null);
    this.selectedDucation.emit(this.duration);
    this.selectedMin = null;
  }

  public selectHours(item) {
    console.log('item',item.item.value);
    this.duration.setHours(item.item.value);
    this.selectedDucation.emit(this.duration);

  }

  public selectMin(item) {
    this.duration.setMinutes(item.item.value);
    this.selectedDucation.emit(this.duration);

  }

  private clearData() {
    this.selectedMin = null;
    this.selectedHours = null;
    this.duration.setHours(null);
    this.duration.setMinutes(null);
    this.selectedDucation.emit(this.duration);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
