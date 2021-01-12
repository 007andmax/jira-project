import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NETWORK_REMOVE_DEVICE } from 'src/ng2/app/const/confirm';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { NetworkScanStateService } from 'src/ng2/app/states/network-scan/network-scan-state.service';
import { Device } from '../../company-devices/class/device';
import { CompanyDevicesEditLabelComponent } from '../../company-devices/company-devices-edit-label/company-devices-edit-label.component';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
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
    private confirmStateService: ConfirmStateService,
    private networkScanStateService: NetworkScanStateService,
    private modalService: NgbModal,
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
    return `${(this.checkUnknown(this.device.description) || this.checkUnknown(this.device.hostName) || this.checkUnknown(this.device.ipAddress))} ${(this.masterAgent && this.device.deviceId === this.masterAgent.id ? '(MASTER AGENT)' : '')}`;
  }
  onChangeName(data) {
    this.devicesService.sendDescription(this.companyId, this.device.id, data).subscribe(res => {
      this.device.setDescription((data.length > 0) ? data : null);
      this.editLabel.setValue((data.length > 0) ? data : this.checkUnknown(this.device.hostName) || this.checkUnknown(this.device.ipAddress));
      this.cd.detectChanges();
    })
  }

  remove() {
    this.confirmStateService.setConfirmAction(NETWORK_REMOVE_DEVICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to remove device?`;
    this.networkScanStateService.setDeviceForRemove(this.device);
  }
}
