import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DeviceCompany } from '../class/device-company';
import { DeviceCompanyAsideParams } from '../class/device-company-aside-params';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { CompanyDeviceFilter } from '../class/device-company-filter';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-devices-header',
  templateUrl: './company-devices-header.component.html',
  styleUrls: ['./company-devices-header.component.scss']
})
export class CompanyDevicesHeaderComponent implements OnInit {
  @Input() devices: Array<DeviceCompany> = [];
  @Input() isOfflineDeviceSelected: boolean = false;
  @Output() onTurnOff = new EventEmitter();
  @Output() onRemoveAgents = new EventEmitter();
  toggleFilter: boolean = false;
  countFilter: number = 0;
  filter: CompanyDeviceFilter = new CompanyDeviceFilter();
  @Output() onToggleFilter = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  constructor(private devicesStateService: DevicesStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    let geLefttFilter = this.devicesStateService.onFilter.subscribe((data) => {
      this.filter.setFilter(JSON.parse(JSON.stringify(data)));
      this.onChangeCountFilter();
      this.cd.detectChanges();
    });
    this.sub.add(geLefttFilter);
    this.onChangeCountFilter();
  }
  public setToggleFilter(data) {
    this.toggleFilter = data;
    this.onToggleFilter.emit(data);
  }
  getCountDevices() {
    let filtesList = [];
    if (this.filter.isAgent && this.filter.isCustomDevices) {
      if (this.filter.assestType.length > 0) return this.devices.filter(item => this.filter.assestType.some(filteritem => filteritem.name.toLocaleLowerCase() == ((item.isCustom) ? (item.type && item.type.name ? item.type.name.toLocaleLowerCase() : '') : item.iconName.toLocaleLowerCase()))).length;
      return this.devices.length;
    } else if (this.filter.isAgent) {
      filtesList = this.devices.filter(item => !item.isCustom);
    } else if (this.filter.isCustomDevices) {
      filtesList = this.devices.filter(item => item.isCustom);
    }
    if (this.filter.assestType.length > 0) return filtesList.filter(item => this.filter.assestType.some(filteritem => filteritem.name.toLocaleLowerCase() == ((item.isCustom) ? (item.type && item.type.name ? item.type.name.toLocaleLowerCase() : '') : item.iconName.toLocaleLowerCase()))).length;
    return filtesList.length;
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  onChangeCountFilter() {
    this.countFilter = 0;
    if (this.filter.assestType.length > 0) this.countFilter++;
    if (this.filter.isAgent) this.countFilter++;
    if (this.filter.isCustomDevices) this.countFilter++;
  }
  getCountSelected() {
    return this.devices.filter(item => item.selected).length;
  }
  turnOff(action) {
    this.onTurnOff.emit(action);
  }
  removeAgents() {
    this.onRemoveAgents.emit(null);
  }
  isExistCustomDevices() {
    return this.devices.some(item => item.selected && item.isCustom);
  }
  openSidebar() {
    this.devicesStateService.setOnOpenAside(new DeviceCompanyAsideParams('SYSTEM', this.devices.filter(item => item.selected && (!item.isCustom && item.agentId || item.isCustom))));
  }
  addDevice() {
    this.devicesStateService.openAsideAddCustom();
  }
}
