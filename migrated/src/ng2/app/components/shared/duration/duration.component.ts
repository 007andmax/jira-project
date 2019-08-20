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
import { DurationService } from './services/duration.service';

@Component({
  selector: 'app-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.scss'],
  providers: [DurationService]
})
export class DurationComponent implements OnInit, OnDestroy {


  @ViewChild('instanceHours') instanceHours: NgbTypeahead;
  @ViewChild('instanceMin') instanceMin: NgbTypeahead;
  @Output() selectedDucation = new EventEmitter<any>();
  @Input() editItem: number;
  public selectedHours;
  public selectedMin;
  public subGetDevicesList: ISubscription;
  public hoursList: any = HOURS;
  public minList: any = MINUTES;
  duration: Duration = new Duration();
  focusHours$ = new Subject<string>();
  clickHours$ = new Subject<string>();
  focusMin$ = new Subject<string>();
  clickMin$ = new Subject<string>();


  /**
   *Creates an instance of the SelectClientCompanyComponent with the injected services
   * @param {CompaniesService} companiesService to work with companiies
   */
  constructor(
    private durationState: DurationStateService,
    private durationService: DurationService

  ) { }

  /**
   * Initializes select client. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.onInitClearState();
    this.onCheckEditItem();
  }
  public onChange(event, type) {
    console.log('this', event.target.value);
    if (type === 'hours') this.duration.setHours(Number(event.target.value));
    if (type === 'minutes') this.duration.setMinutes(Number(event.target.value));
    this.selectedDucation.emit(this.duration);
  }
  private onCheckEditItem() {

    if (this.editItem) {
      var timeInMinutes = this.editItem * 60,
        hours = Math.floor(timeInMinutes / 60),
        minutes = Math.round(timeInMinutes - (hours * 60));
      this.selectedHours = this.durationService.parse(hours);
      this.selectedMin = this.durationService.parse(minutes);
      console.log(' this.selectedHours', this.selectedHours);
      console.log(' this.selectedMin', this.selectedMin);
      this.duration.setHours(this.selectedHours.value);
      this.duration.setMinutes(this.selectedMin.value);
    }
  }
  private onInitClearState() {
    let getClearState = this.durationState.getClearState().subscribe(() => this.clearData());
    this.durationService.addSubscription(getClearState);
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
    this.durationService.clearSubscription();
  }
}
