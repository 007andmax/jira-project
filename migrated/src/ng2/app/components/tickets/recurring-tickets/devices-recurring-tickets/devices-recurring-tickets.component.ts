import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { merge, Observable, Subject, Subscription } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from "@angular/forms";
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import {  DevicesRecurringTicketsStateService } from './services/devices-recurring-tickets-state.service';
import { DevicesSateService } from 'src/ng2/app/states/devices/devices-sate.service';


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
  @Input() editItem: any;
  public selectedDevice;
  public subGetDevicesList: ISubscription;
  public devicesList: any;
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
    private devicesStateService:DevicesSateService,
    public cd: ChangeDetectorRef,
  ) { }

  /**
   * Initializes deices. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getCLientsList();
    this.onInitClearState();
   
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
    this.subGetDevicesList = this.devicesRecurringTicketsStateService.devicesCompany.subscribe((res: any) => {
      if (this.devicesStateService.getAllDevices()[res])
      {
        this.devicesList = this.devicesStateService.getAllDevices()[res].map((item) => {
          item.name = item.hostName;
          return item;
        });
      } else {
        this.devicesList = [];
      }
    
    
      this.devicesList = (this.devicesList.length === 0) ? null : this.devicesList;
      if (!this.devicesList) this.clearDevices();
        if (this.editItem && this.devicesList)
        {
          let index: number = this.devicesList.findIndex(item => item.id === this.editItem.deviceId);
          if (index > (-1))  {
            this.selectedDevice = this.devicesList[index];
          }
        }
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
    this.selectedItem.emit(null);
    this.selectedDevice = null;
  }

  ngOnDestroy(): void {
   this.sub.unsubscribe();
  }

}
