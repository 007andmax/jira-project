import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { merge, Observable, Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesRecurringTicketsStateService } from './services/devices-recurring-tickets-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';


@Component({
  selector: 'app-devices-recurring-tickets',
  templateUrl: './devices-recurring-tickets.component.html',
  styleUrls: ['./devices-recurring-tickets.component.scss']
})
export class DevicesRecurringTicketsComponent implements OnInit, OnDestroy {


  @ViewChild('instance') instance: NgbTypeahead;
  @Output() selectedItem = new EventEmitter<any>();
  @Output() getAllItems = new EventEmitter<any>();
  @Input() companyId: string;
  @Input() editItem: any;
  public selectedDevice;
  public devicesList: any;
  preloader: boolean = false;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  sub = new Subscription();
  /**
  * Creates an instance of the DevicesRecurringTicketsComponent with the injected services
  * @param {DevicesService} devicesService Service to work with devices
  * @param {DevicesStateService} devicesState to work devices state
  * @param {ChangeDetectorRef} cd Service to work with change detector
  */
  constructor(
    private devicesService: DevicesService,
    private devicesRecurringTicketsStateService: DevicesRecurringTicketsStateService,
    private devicesStateService: DevicesStateService,
    public cd: ChangeDetectorRef,
  ) { }

  /**
   * Initializes deices. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getCLientsList();
    this.onInitClearState();
    if (this.companyId) this.getDevices();
    let onDeviceUninstalled = this.devicesStateService.onChangeDevice.subscribe(newChange => {
      if (this.companyId == newChange.data.clientCompanyId) this.devicesStateService.changeDevice(this.devicesList, newChange);
    })
    this.sub.add(onDeviceUninstalled);
  }

  /**
   * Initializes subscribe to clear state.
   */
  private onInitClearState() {
    let getClearState = this.devicesRecurringTicketsStateService.getClearState().subscribe(() => {
      this.clearDevices();
      this.devicesList = null;
    });
    this.sub.add(getClearState);
  }

  /**
   * Get devices list
   */
  private getCLientsList() {
    let subGetDevicesList = this.devicesRecurringTicketsStateService.devicesCompany.subscribe((res: any) => {
      this.companyId = res;
      this.getDevices();
    })
    this.sub.add(subGetDevicesList);
  }

  getDevices() {
    this.preloader = true;
    this.selectedDevice = null;
    this.devicesService.getCompanyDevices(this.companyId).subscribe((data: any) => {
      this.preloader = false;
      this.devicesList = (data[this.companyId]) ? JSON.parse(JSON.stringify(data[this.companyId])).filter(item => !item.isCustom).map((item) => {
        item.name = item.hostName;
        return item;
      }) : null;
      if (!this.devicesList) this.clearDevices();
      if (this.editItem && this.devicesList) {
        let index: number = this.devicesList.findIndex(item => item.id === this.editItem.deviceId);
        if (index > (-1)) {
          this.selectedDevice = this.devicesList[index];
        }
      }
      this.getAllItems.emit(this.devicesList);
    });
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
  public selectItem(device) {
    this.selectedItem.emit(device);
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
    this.devicesList = null;
    this.selectedItem.emit(null);
    this.selectedDevice = null;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
