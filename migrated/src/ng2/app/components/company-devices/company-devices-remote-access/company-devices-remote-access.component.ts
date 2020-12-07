import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { ConstantsStateService } from 'src/ng2/app/states/constants/constants-state.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { DeviceCompany } from '../class/device-company';

@Component({
  selector: 'app-company-devices-remote-access',
  templateUrl: './company-devices-remote-access.component.html',
  styleUrls: ['./company-devices-remote-access.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class CompanyDevicesRemoteAccessComponent implements OnInit {
  @Input() connectionType: string;
  @Input() device: DeviceCompany;
  @Input() companyId: string;
  sessionId: string;
  isConnection: boolean = false;
  constructor(private constantsStateService: ConstantsStateService,
    private devicesStateService: DevicesStateService,
    public activeModal: NgbActiveModal,
    private devicesService: DevicesService) { }

  ngOnInit() {
    this.devicesStateService.getOnLaunchRemoteApp().subscribe(data => {
      if (data === this.sessionId) this.close();
    })
  }
  downloadViewer() {
    window.location.href = '/data/connection-viewer';
  }
  launchRemoteApp() {
    this.devicesService.createRemoteSession(this.device.id, this.companyId, this.connectionType, null).subscribe((resp: any) => {
      this.sessionId = resp.sessionId;
      let remoteConnectPort = this.constantsStateService.getConstant('remote.connect.port'),
        restServerAddress = this.constantsStateService.getConstant('rest.server.address'),
        url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + resp.sessionId;
      window.open(url, '_self');
      this.isConnection = true;
    })
  }
  close() {
    this.activeModal.dismiss('Cross click');
  }
}
