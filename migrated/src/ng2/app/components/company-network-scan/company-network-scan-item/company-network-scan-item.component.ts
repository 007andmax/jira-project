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
  shownTooltip() {
    console.log("shownTooltip");
    this.cd.detectChanges();
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
  getStatusText() {
    if (this.device.agentStatus === 'managed') {
      return 'Managed';

    } else if (this.device.agentStatus === 'Installed') {

      return 'Installed';
    } else if (this.device.agentStatus === 'Install error') {

      return 'Install error';

    } else if (this.device.agentStatus === 'ErrorInitialization') {

      return 'Error Initialization';

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
  getClass() {
    if (this.device.agentStatus === 'managed' || this.device.agentStatus === 'Installed' || this.device.agentStatus === 'unknown') return ['tag__modern', '--success']
    if (this.device.agentStatus === 'Install error' || this.device.agentStatus === 'ErrorInitialization' || this.device.agentStatus === 'Bad password' || this.device.agentStatus === 'unknown' || this.device.agentStatus === 'ErrorUac') return ['tag__modern', '--error']
    if (this.device.agentStatus === 'Blocked') return ['tag__modern', '--gray']
    if (this.device.agentStatus === 'Installing' || this.device.agentStatus === 'init') return ['qt-sz-18', 'qt-loading', '--blue', 'qt-ml-20']

  }
  remove() {
    this.devicesService.sendUninstallAgentRequest(this.companyId, [this.device.deviceId]).subscribe(data => {

    })
  }
}
