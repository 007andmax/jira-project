import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { TicketProfile } from '../../../class/ticket-profile';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { forkJoin, Subscription } from 'rxjs';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_DEVICES } from 'src/app/const/confirm';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DevicesRealTimeService } from 'src/app/states/devices/devices-real-time.service';

@Component({
  selector: 'ticket-detail-devices-details',
  templateUrl: './ticket-detail-devices-details.component.html',
  styleUrls: ['./ticket-detail-devices-details.component.scss']
})
export class TicketDetailDevicesDetailsComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  devices: Array<DeviceCompany> = [];
  devicesReq: Array<DeviceCompany> = [];
  isSearch: boolean = false;
  sub: Subscription = new Subscription();
  @Output() onClose = new EventEmitter<any>();
  constructor(public ticketStateService: TicketStateService,
    private confirmStateService: ConfirmStateService,
    private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    public cd: ChangeDetectorRef,
    private devicesRealTimeService: DevicesRealTimeService,
    private elRef: ElementRef,) { }

  ngOnInit() {
    this.devices = this.ticketStateService.getDevices();
    this.devicesReq = this.ticketStateService.getDevices();
    let onGetDevices = this.ticketStateService.onGetDevices.subscribe(data => {
      this.devices = data;
      this.devicesReq = data;
    })
    this.sub.add(onGetDevices);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_DEVICES) {
          if (this.devicesStateService.getDevicesForRemove().filter(item => item.isCustom).length > 0) this.removeCustomDevice(this.devicesStateService.getDevicesForRemove().filter(item => item.isCustom).map(item => item.deviceId));
          if (this.devicesStateService.getDevicesForRemove().filter(item => !item.isCustom).length > 0) this.devicesService.sendUninstallAgentRequest(this.ticketProfile.company.id, this.devicesStateService.getDevicesForRemove().map(item => item.deviceId)).subscribe(data => {
            let ids = this.devicesStateService.getDevicesForRemove().filter(item => !item.isCustom).map(item => item.deviceId);
            this.devices = this.devices.filter(item => !ids.includes(item.deviceId));
          });
        }
      }
    });
    this.sub.add(getConfirm);
    let changeDevicesArray = this.devicesRealTimeService.changeDevicesArray.subscribe(newChange => {
      if (newChange.action === 'CUSTOM_DEVICE_REMOVED') {
        let index = this.devices.findIndex(item => item.deviceId == newChange.data);
        if (index > -1) this.devices.splice(index, 1);
      }
      this.cd.detectChanges();
    })
    this.sub.add(changeDevicesArray);
  }
  clearSearch() {
    this.devices = JSON.parse(JSON.stringify(this.devicesReq)).map(item => new DeviceCompany(item, this.ticketProfile.company.id));
    this.elRef.nativeElement.querySelector("#search-devices").value = '';
    this.isSearch = false;
  }
  removeCustomDevice(ids) {
    forkJoin(
      [...ids.map(item => this.devicesService.deleteCustomDevice(item))]
    )
      .subscribe(res => {
        this.devices = this.devices.filter(item => !ids.includes(item.deviceId));
      });
  }
  search(event) {
    if (event.target.value.length > 0) {
      this.devices = this.devicesReq.filter(item => item.getLabelForEdit().toLowerCase().includes(event.target.value.toLowerCase()));
      this.isSearch = true;
    } else {
      this.devices = JSON.parse(JSON.stringify(this.devicesReq)).map(item => new DeviceCompany(item, this.ticketProfile.company.id));
      this.isSearch = false;
    }
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  close() {
    this.onClose.emit(null);
  }
}
