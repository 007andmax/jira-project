import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { ConstantsStateService } from 'src/app/states/constants/constants-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { environment } from 'src/environments/environment';
import { RemoteControlService } from '../../device/_services/remoteControl.service';
import { DeviceCompany } from '../class/device-company';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-devices-remote-access',
  templateUrl: './company-devices-remote-access.component.html',
  styleUrls: ['./company-devices-remote-access.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class CompanyDevicesRemoteAccessComponent implements OnInit, OnDestroy {
  @Input() connectionType: string;
  @Input() remoteSessionId: string;
  @Input() device: DeviceCompany;
  @Input() companyId: string;
  @Input() guid: string;
  @Input() action: string;
  webserverDomain = environment.webserverDomain;
  sessionId: string;
  isConnection: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private constantsStateService: ConstantsStateService,
    private devicesStateService: DevicesStateService,
    public activeModal: NgbActiveModal,
    private remoteControlService: RemoteControlService,
    private devicesService: DevicesService) { }

  ngOnInit() {
    let getOnLaunchRemoteApp = this.devicesStateService.getOnLaunchRemoteApp().subscribe(data => {
      if (data === this.sessionId) this.close();
    })
    this.sub.add(getOnLaunchRemoteApp);
    this.launchRemoteApp();

  }
  downloadViewer() {
    if (this.action == "CONNECT_DEVICE_BETA") {
      window.location.href = '/data/downloadViewerInstaller';
    } else {
      window.location.href = '/data/downloadViewerInstaller';
    }
  }
  getConstant(sessionId) {
    this.remoteControlService
      .getConstant()
      .pipe()
      .subscribe(
        (resp) => {
          let url =
            "quicktech://connect?serverIP=" +
            resp["rest.server.url"] +
            "&port=" +
            resp["remote.connect.port"] +
            "&sessionID=" +
            sessionId;
          window.open(url, "_self");
          this.isConnection = true;
        },
        (error) => { }
      );
  }
  launchRemoteApp() {
    if (this.action === 'CONNECT_DEVICE_BETA') {
      let data = {
        assetId: this.guid,
        type: this.connectionType,
        companyId: this.companyId,
      };
      this.remoteControlService
        .createConnection2(data)
        .pipe()
        .subscribe(
          (resp) => {
            if (this.connectionType === "CSS") {
              this.getConstant(resp.sessionId);
            } else {
              this.getConstant(resp.sessionId);
            }
          }
        );
    }
    if (this.action === 'CONNECT_DEVICE') {
      this.devicesService.createRemoteSession(this.device.id, this.companyId, this.connectionType, null).subscribe((resp: any) => {
        this.sessionId = resp.sessionId;
        let remoteConnectPort = this.constantsStateService.getConstant('remote.connect.port'),
          restServerAddress = this.constantsStateService.getConstant('rest.server.address'),
          url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + resp.sessionId + '&webserverDomain=' + this.webserverDomain;
        window.open(url, '_self');
        this.isConnection = true;
      })
    }
    if (this.action === 'CONNECT_SUPPORT_DEVICE') {
      this.devicesService.getSessionId(this.remoteSessionId, this.connectionType).subscribe((realSessionId: any) => {
        if (!realSessionId || !realSessionId.sessionId || realSessionId.sessionId.length < 1) {
          throw "Not session Id"
        } else {
          this.sessionId = realSessionId.sessionId;
          let remoteConnectPort = this.constantsStateService.getConstant('remote.connect.port'),
            restServerAddress = this.constantsStateService.getConstant('rest.server.address'),
            url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + realSessionId.sessionId;
          window.open(url, '_self');
          this.isConnection = true;
        }
      });
    }

  }
  close() {
    this.activeModal.dismiss('Cross click');
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
