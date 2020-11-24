import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { ConstantsStateService } from 'src/ng2/app/states/constants/constants-state.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-sate.service';
import { Device } from '../class/device';
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
    console.log("device", this.device);
    console.log("companyId", this.companyId);
    this.devicesService.createRemoteSession(this.device.id, this.companyId, this.connectionType, null).subscribe((resp: any) => {
      //this.connectRemoteAccess(resp.sessionId, connectionType, false);
      this.sessionId = resp.sessionId;
      let remoteConnectPort = this.constantsStateService.getConstant('remote.connect.port'),
        restServerAddress = this.constantsStateService.getConstant('rest.server.address'),
        url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + resp.sessionId;
      /* modalInstance.result.then(angular.noop, function () {
         if (promise) {
           $interval.cancel(promise);
         }
       });*/
      /* this.
      DevicesService.subscribeToRemoteConnection(realSessionId, function () {
        if (modalInstance) {
          modalInstance.dismiss();
        }
        if (promise) {
          $interval.cancel(promise);
        }
        $rootScope.currentRemoteSessionId = realSessionId;
      });*/
      window.open(url, '_self');
    })

  }
  close() {
    this.activeModal.dismiss('Cross click');
  }
}
