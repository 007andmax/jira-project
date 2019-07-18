import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { merge, Observable, Subject, Subscription } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from "@angular/forms";
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { DevicesStateService } from './services/devices-state.service';


@Component({
  selector: 'app-devices-recurring-tickets',
  templateUrl: './devices-recurring-tickets.component.html',
  styleUrls: ['./devices-recurring-tickets.component.scss']
})
export class DevicesRecurringTicketsComponent implements OnInit,OnDestroy {
  

  @ViewChild('instance') instance: NgbTypeahead;
  @Output() selectedItem = new EventEmitter<any>();
  @Output() getAllItems = new EventEmitter<any>();
  @Input() companyId: string;
  public selectedDevice;
  public subGetDevicesList: ISubscription;
  public devicesList: any;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  sub = new Subscription();
  /**
   *Creates an instance of the SelectClientCompanyComponent with the injected services
   * @param {CompaniesService} companiesService to work with companiies
   */
  constructor(
    private devicesService: DevicesService,
    private devicesState: DevicesStateService,
    public cd: ChangeDetectorRef,
  ) { }

  /**
   * Initializes select client. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getCLientsList();
    this.onInitClearState();
  }

  private onInitClearState() {
    let getClearState = this.devicesState.getClearState().subscribe(() => {
      this.clearDevices();
      this.devicesList = null;
    
    
    });
    this.sub.add(getClearState);
   }
  /**
   * Get client list
   */
  private getCLientsList() {
    this.subGetDevicesList = this.devicesService.devicesCompany.subscribe((res: any) => {
      this.devicesList = res.map((item) => {
        item.name = item.hostName;
        return item;
      });
    
      this.devicesList = (this.devicesList.length === 0) ? null : this.devicesList;
      /*res
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((item) => !item.deletedAt)*/
        this.getAllItems.emit(this.devicesList);
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
      map(term => (term === '' ? this.devicesList
        : this.devicesList && this.devicesList
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
  public clearDevices() {
    this.selectedItem.emit('null');
    this.selectedDevice = null;
  }

  ngOnDestroy(): void {
   this.sub.unsubscribe();
  }

}
