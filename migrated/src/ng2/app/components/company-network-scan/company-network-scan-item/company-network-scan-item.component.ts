import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { Device } from '../../company-devices/class/device';
import { NetworkScanDevice } from '../class/network-scan-device';
import { NetworkScanSomeInfoForDevice } from '../class/network-scan-some-info-for-devices';

@Component({
  selector: 'app-company-network-scan-item',
  templateUrl: './company-network-scan-item.component.html',
  styleUrls: ['./company-network-scan-item.component.scss']
})
export class CompanyNetworkScanItemComponent implements OnInit {
  @Input() networkScanSomeInfoForDevice: NetworkScanSomeInfoForDevice;
  @Input() device: NetworkScanDevice;
  @Input() masterAgent: Device = null;
  @Input() companyId: string;
  @Output() onSelect = new EventEmitter<any>();
  constructor(private devicesService: DevicesService) { }

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
      this.device.setDescription(data);
    })
    console.log("data", data);
  }
  getStatusText() {
    if (this.device.agentStatus === 'managed') {
      return 'Managed';

    } else if (this.device.agentStatus === 'Installed') {

      return 'Installed';
    } else if (this.device.agentStatus === 'Install error') {

      return 'Install error';

    } else if (this.device.agentStatus === 'Bad password') {

      return 'Bad password';

    } else if (this.device.agentStatus === 'Installing' /*
      || ($scope.device.agentPassword && $scope.device.agentPassword.status === 'PROCEED')*/) {

      return '';

    } else if (this.device.agentStatus === 'init') {

      return 'Copy install files'

    } else if (this.device.agentStatus === 'Blocked') {

      return 'Blocked';

    } else if (this.device.agentStatus === 'ErrorUac') {

      return 'Error Uac';

    } else {


      /*  if ($scope.device.agentPassword && $scope.device.agentPassword.status === 'SUCCESS') {
          return 'Correct';
        } else {
          return 'Not Monitored';
        }
  */
    }
  }
  remove() {
    this.devicesService.sendUninstallAgentRequest(this.companyId, [this.device.deviceId]).subscribe(data => {

    })
  }
}
