import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DeviceCompany } from 'src/app/components/company-devices/class/device-company';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { REMOVE_DEVICES } from 'src/app/const/confirm';
import { Subscription, forkJoin } from 'rxjs';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesRealTimeService } from 'src/app/states/devices/devices-real-time.service';
import { TicketProfile } from '../../class/ticket-profile';

@Component({
  selector: 'ticket-detail-devices',
  templateUrl: './ticket-detail-devices.component.html',
  styleUrls: ['./ticket-detail-devices.component.scss']
})
export class TicketDetailDevicesComponent implements OnInit, OnDestroy {
  @Output() onShowMore = new EventEmitter<any>();
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  toggleContainer: boolean = true;
  devices: Array<DeviceCompany> = [];
  sub: Subscription = new Subscription();
  constructor(public ticketStateService: TicketStateService,
    private confirmStateService: ConfirmStateService,
    private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,
    public cd: ChangeDetectorRef,
    private devicesRealTimeService: DevicesRealTimeService
  ) { }


  ngOnInit() {
    this.devices = this.ticketStateService.getDevices();
    this.ticketStateService.onGetDevices.subscribe(data => {
      this.devices = data;
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_DEVICES) {
          if (this.devicesStateService.getDevicesForRemove().filter(item => item.isCustom).length > 0) this.removeCustomDevice(this.devicesStateService.getDevicesForRemove().filter(item => item.isCustom).map(item => item.deviceId));
          if (this.devicesStateService.getDevicesForRemove().filter(item => !item.isCustom).length > 0) this.devicesService.sendUninstallAgentRequest(this.ticketProfile.company.id, this.devicesStateService.getDevicesForRemove().map(item => item.deviceId)).subscribe(data => {
            this.confirmStateService.initRequest(false);
            let ids = this.devicesStateService.getDevicesForRemove().filter(item => !item.isCustom).map(item => item.deviceId);
            this.devices = this.devices.filter(item => !ids.includes(item.deviceId));
          }, err => {
            this.confirmStateService.initRequest(false);
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
  removeCustomDevice(ids) {
    forkJoin(
      [...ids.map(item => this.devicesService.deleteCustomDevice(item))]
    )
      .subscribe(res => {
        this.confirmStateService.initRequest(false);
        this.devices = this.devices.filter(item => !ids.includes(item.deviceId));
      }, err => {
        this.confirmStateService.initRequest(false);
      });
  }
  public trackByIndex(index, item) {
    return index;
  }
  showMore() {
    this.onShowMore.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
