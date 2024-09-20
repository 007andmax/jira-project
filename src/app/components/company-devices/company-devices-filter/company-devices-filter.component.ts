import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemFilterPerson } from '../../left-panel/left-panel-companies/class/item-filter-person';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { CompanyDeviceFilter } from '../class/device-company-filter';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { CompanyDevicesFilterTypeComponent } from './company-devices-filter-type/company-devices-filter-type.component';

@Component({
  selector: 'app-company-devices-filter',
  templateUrl: './company-devices-filter.component.html',
  styleUrls: ['./company-devices-filter.component.scss']
})
export class CompanyDevicesFilterComponent implements OnInit {
  assestType: Array<string> = ["Workstation",
    "Router",
    "Printer",
    "Switch",
    "Server",
    "Tablet",
    "Network Device",
    "Phone",
    "Generic device"];
  filter: CompanyDeviceFilter = new CompanyDeviceFilter();
  @ViewChild('typesDp') typesDp: CompanyDevicesFilterTypeComponent;
  @Output() changeCountFilter = new EventEmitter<any>();
  @Output() onClose = new EventEmitter();
  sub: Subscription = new Subscription();
  constructor(private devicesStateService: DevicesStateService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {

  }

  onChangeCustomDevice(event) {
    this.filter.setIsCustomDevices(event.target.checked);
  }
  onChangeAgent(event) {
    this.filter.setIsAgent(event.target.checked);
  }
  public onClearAll() {
    this.typesDp.clearWithOutChanges();
    this.filter.setIsCustomDevices(false);
    this.filter.setIsAgent(false);
    this.devicesStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
    this.cd.detectChanges();
  }
  close() {
    this.onClose.emit(null);
    this.cd.detectChanges();
  }
  applyFilters() {
    this.devicesStateService.onInitFilter(this.filter);
    this.onChangeCounterFilter();
    this.cd.detectChanges();
  }

  public onSelectType(data) {
    this.filter.setAssestType(data);
    this.cd.markForCheck();
  }

  public onChangeCounterFilter() {
    let count = 0;
    if (this.filter.assestType) count++;
    this.changeCountFilter.emit(count);
    this.cd.detectChanges();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
