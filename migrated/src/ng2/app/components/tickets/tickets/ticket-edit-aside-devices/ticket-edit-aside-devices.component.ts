import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalQuoteComponent } from 'src/ng2/app/services/modal/modal-quote/modal-quote.component';
import { data } from 'jquery';
import { ModalCustomShareScreenComponent } from 'src/ng2/app/services/modal/modal-custom-share-screen/modal-custom-share-screen.component';
import { ConstantsStateService } from 'src/ng2/app/states/constants/constants-state.service';
import { Subscription } from 'rxjs';
import { CompanyDevicesRemoteAccessComponent } from '../../../company-devices/company-devices-remote-access/company-devices-remote-access.component';

@Component({
  selector: 'app-ticket-edit-aside-devices',
  templateUrl: './ticket-edit-aside-devices.component.html',
  styleUrls: ['./ticket-edit-aside-devices.component.scss'],
  providers: [NgbModalConfig, NgbModal],
})
export class TicketEditAsideDevicesComponent implements OnInit, OnDestroy {
  devices = [];
  reqDevices = [];
  companyId: string = '';
  showRemoteAccess: boolean = false;
  realSessionId: string;
  lastCompanyId: string;
  isOpenDropDown: boolean = false;
  @Input() set setCompanyId(value) {
    this.companyId = value;
    this.onGetDevices();
  };
  sub: Subscription = new Subscription();
  constructor(private devicesStateService: DevicesStateService,
    private constantsStateService: ConstantsStateService,
    private modalService: NgbModal,
    private elRef: ElementRef,
    config: NgbModalConfig,
    private devicesService: DevicesService,) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit() {
    this.onGetDevices();
    let getOnRemoveConnection = this.devicesStateService.getOnRemoveConnection().subscribe(data => {
      let remoteConnectPort = this.constantsStateService.getConstant('remote.connect.port'),
        restServerAddress = this.constantsStateService.getConstant('rest.server.address'),
        url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + this.realSessionId;
      window.open(url, '_self');
    })
    this.sub.add(getOnRemoveConnection);
    $(this.elRef.nativeElement).scroll(() => {
      if (!this.isOpenDropDown) return;
      let list = this.elRef.nativeElement.querySelectorAll('.dropdown-menu-qt');
      list.forEach(element => {
        $(element).css({ display: 'none' });
      });
      this.isOpenDropDown = false;
    });
  }
  onOpenDropDown(input, dropDown) {
    let list = this.elRef.nativeElement.querySelectorAll('.dropdown-menu-qt');
    list.forEach(element => {
      $(element).css({ display: 'none' });
    });
    let viewportOffset = input.getBoundingClientRect();
    $(dropDown).css({ top: `${viewportOffset.y}px`, left: `${viewportOffset.x - $(dropDown).height()}px`, display: 'block' });
    this.isOpenDropDown = true;
  }
  hiddenDropDown(data) {
    $(data).css({ display: 'none' });
  }
  onGetDevices() {
    if (this.companyId && this.lastCompanyId !== this.companyId) {
      this.lastCompanyId = this.companyId;
    } else {
      return;
    }
    let devices = (this.devicesStateService.getAllDevices()) ? this.devicesStateService.getAllDevices()[this.companyId] : [];

    if (devices) devices.sort((a, b) => (a.hostName.toLowerCase() > b.hostName.toLowerCase()) ?
      1 : ((b.hostName.toLowerCase() > a.hostName.toLowerCase()) ? -1 : 0));
    this.devices = (devices) ? devices : [];
    this.reqDevices = (devices) ? devices : [];
  }
  onSearch(event) {
    if (event.target.value === "") {
      this.devices = JSON.parse(JSON.stringify(this.reqDevices));
      return;
    }
    this.devices = this.reqDevices.filter(item => item.hostName.toLowerCase().includes(event.target.value.toLowerCase()));
  }
  remoteAccess(connectionType, device) {
    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'device-send-modal' });
    modalRef.componentInstance.connectionType = connectionType;
    modalRef.componentInstance.device = device;
    modalRef.componentInstance.companyId = this.companyId;
    modalRef.componentInstance.action = 'CONNECT_DEVICE';
    /* this.devicesService.createRemoteSession(device.id, this.companyId, connectionType, null).subscribe((resp: any) => {
       this.connectRemoteAccess(resp.sessionId, connectionType, false);
     })*/
  };
  restart(device) {
    this.devicesService.sendPowerAction(this.companyId, device.agentId, 'reboot').subscribe(data => {

    });

  };
  shutdown(device) {
    this.devicesService.sendPowerAction(this.companyId, device.agentId, 'shutdown').subscribe(data => {

    });

  };
  markDeviceAsMaster(device) {
    this.devicesService.markDeviceAsMaster(this.companyId, device.agentId).subscribe(data => {

    })
  }
  remove(device) {
    this.devicesService.sendUninstallAgentRequest(this.companyId, device.agentId).subscribe(data => {

    })

  }
  /* public connectRemoteAccess(sessionId, conectionType, isOneTime) {
     if (!sessionId) {
       throw 'SessionId is required';
     }
     if (!conectionType) {
       throw 'conectionType is required';
     }
     if (isOneTime) {
       this.devicesService.getSessionId(sessionId, conectionType).subscribe((realSessionId: any) => {
         if (!realSessionId || !realSessionId.sessionId || realSessionId.sessionId.length < 1) {
           throw "Not session Id"
         } else {
           this.createRemoteAccess(realSessionId.sessionId);
         }
       });
     } else {
       this.createRemoteAccess(sessionId);
     }
   }
   createRemoteAccess(realSessionId) {
     this.realSessionId = realSessionId;
     const modalRef = this.modalService.open(ModalCustomShareScreenComponent, null);
     modalRef.componentInstance.companyId = this.companyId;
   }*/
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
