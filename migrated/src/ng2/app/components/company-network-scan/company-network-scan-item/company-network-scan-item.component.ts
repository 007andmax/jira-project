import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { Device } from '../../company-devices/class/device';
import { CompanyDevicesEditLabelComponent } from '../../company-devices/company-devices-edit-label/company-devices-edit-label.component';
import { NetworkScanDevice } from '../class/network-scan-device';
import { NetworkScanSomeInfoForDevice } from '../class/network-scan-some-info-for-devices';

@Component({
  selector: 'app-company-network-scan-item',
  templateUrl: './company-network-scan-item.component.html',
  styleUrls: ['./company-network-scan-item.component.scss']
})
export class CompanyNetworkScanItemComponent implements OnInit {
  @ViewChild('editLabel') editLabel: CompanyDevicesEditLabelComponent;
  @Input() networkScanSomeInfoForDevice: NetworkScanSomeInfoForDevice;
  @Input() device: NetworkScanDevice;
  @Input() masterAgent: Device = null;
  @Input() companyId: string;
  @Output() onSelect = new EventEmitter<any>();
  constructor(private devicesService: DevicesService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  onSelectDevice() {
    this.onSelect.emit(null);
  }
  checkUnknown(value) {
    return (value === "unknown") ? null : value;
  }
  getLabel() {
    return `${(this.checkUnknown(this.device.description) || this.checkUnknown(this.device.hostName) || this.checkUnknown(this.device.ipAddress))} ${(this.device.deviceId === this.masterAgent.id ? '(MASTER AGENT)' : '')}`;
  }
  onChangeName(data) {
    this.devicesService.sendDescription(this.companyId, this.device.id, data).subscribe(res => {
      this.device.setDescription((data.length > 0) ? data : null);
      this.editLabel.setValue((data.length > 0) ? data : this.checkUnknown(this.device.hostName) || this.checkUnknown(this.device.ipAddress));
      this.cd.detectChanges();
    })
    console.log("data", data);
  }

  remove() {
    this.devicesService.sendUninstallAgentRequest(this.companyId, [this.device.deviceId]).subscribe(data => {

    })
  }
}
