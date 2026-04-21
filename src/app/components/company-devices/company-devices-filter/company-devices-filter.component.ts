import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemFilterPerson } from '../../left-panel/left-panel-companies/class/item-filter-person';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { CompanyDeviceFilter } from '../class/device-company-filter';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { CompanyDevicesFilterTypeComponent } from './company-devices-filter-type/company-devices-filter-type.component';
import { DeviceType } from '../class/device-type';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
    selector: 'app-company-devices-filter',
    templateUrl: './company-devices-filter.component.html',
    styleUrls: ['./company-devices-filter.component.scss'],
    standalone: true
})
export class CompanyDevicesFilterComponent implements OnInit {
  assestType: Array<DeviceType> = [];
  filter: CompanyDeviceFilter = new CompanyDeviceFilter();
  @ViewChild('typesDp', { static: true }) typesDp: CompanyDevicesFilterTypeComponent;
  @Output() changeCountFilter = new EventEmitter<any>();
  @Output() onClose = new EventEmitter();
  sub: Subscription = new Subscription();
  constructor(private devicesStateService: DevicesStateService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    if (this.devicesStateService.isGetDeviceType) this.assestType = this.devicesStateService.getDeviceTypes();
    if (!this.devicesStateService.isGetDeviceType) this.devicesStateService.initGetDeviceType();
    let onGetDeviceType = this.devicesStateService.onGetDeviceType.subscribe(data => {
      this.assestType = data;
    })
    this.sub.add(onGetDeviceType);
    let onClearFilter = this.devicesStateService.onClearFilter.subscribe(() => {
      this.onClearAll();
    });
    this.sub.add(onClearFilter);
  }

  onChangeCustomDevice(event) {
    this.filter.setIsCustomDevices(event.target.checked);
  }
  onChangeAgent(event) {
    this.filter.setIsAgent(event.target.checked);
  }
  public onClearAll() {
    this.typesDp.clearWithOutChanges();
    this.filter.setAssestType([]);
    this.filter.setIsCustomDevices(true);
    this.filter.setIsAgent(true);
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
