import { Component, OnInit, Input } from '@angular/core';
import { DevicesSateService } from 'src/ng2/app/states/devices/devices-sate.service';
import { DevicesService } from 'src/ng2/app/services/devices/devices.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalQuoteComponent } from 'src/ng2/app/services/modal/modal-quote/modal-quote.component';
import { data } from 'jquery';
import { ModalCustomShareScreenComponent } from 'src/ng2/app/services/modal/modal-custom-share-screen/modal-custom-share-screen.component';
import { ConstantsStateService } from 'src/ng2/app/states/constants/constants-state.service';

@Component({
  selector: 'app-ticket-edit-aside-devices',
  templateUrl: './ticket-edit-aside-devices.component.html',
  styleUrls: ['./ticket-edit-aside-devices.component.scss'],
  providers: [ NgbModalConfig, NgbModal],
})
export class TicketEditAsideDevicesComponent implements OnInit {
  devices = [];
  reqDevices = [];
  @Input() companyId: string = '';
  showRemoteAccess:boolean = false;
  realSessionId:string;
  constructor(private devicesSateService: DevicesSateService,
    private constantsStateService:ConstantsStateService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private devicesService:DevicesService,) { 
      config.backdrop = 'static';
      config.keyboard = false;
    }

  ngOnInit() {
    let devices = this.devicesSateService.getAllDevices()[this.companyId]
    this.devices = (devices) ? devices : [];
    this.reqDevices = (devices) ? devices : []
    console.log("this.devices", this.devices);
    this.devicesSateService.getOnRemoveConnection().subscribe(data => {
     let remoteConnectPort = this.constantsStateService.getConstant('remote.connect.port'),
      restServerAddress = this.constantsStateService.getConstant('rest.server.address'),
      url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + this.realSessionId;
      console.log("url",url);
    //  window.open(url);
       window.open(url, '_self');
   /* DevicesService.subscribeToRemoteConnection(realSessionId, function () {
      if (modalInstance) {
        modalInstance.dismiss();
      }
      if (promise) {
        $interval.cancel(promise);
      }
      $rootScope.currentRemoteSessionId = realSessionId;
    });
    window.open(url, '_self');*/
    })
  }
  onSearch(event) {
    console.log("event", event.target);
    if (event.target.value === "") {
      this.devices = JSON.parse(JSON.stringify(this.reqDevices));
      return;
    }
    this.devices = this.reqDevices.filter(item => item.hostName.toLowerCase().includes(event.target.value));
  }
   remoteAccess  (connectionType,device) {
  
      this.devicesService.createRemoteSession(device.id,this.companyId,connectionType,null).subscribe((resp:any) => {
        console.log("resp",resp);
        this.connectRemoteAccess(resp.sessionId, connectionType,false);
      })

 /*  hideThisPopover();
    DevicesService.createRemoteSession(deviceId, companyId, connectionType, function (resp) {
      RemoteAccessService.connectRemoteAccess(resp.sessionId, connectionType);
    });*/
   
  };
   restart  (device) {
    this.devicesService.sendPowerAction(this.companyId, device.agentId, 'reboot').subscribe(data => {

    });
   
  };
   shutdown  (device) {
    this.devicesService.sendPowerAction(this.companyId, device.agentId, 'shutdown').subscribe(data => {

    });
   
  };
  markDeviceAsMaster(device) {
    this.devicesService.markDeviceAsMaster(this.companyId, device.agentId).subscribe(data => {

    })
  }
   remove  (device) {
    this.devicesService.sendUninstallAgentRequest(this.companyId, device.agentId).subscribe(data => {

    })
    
  }
  public connectRemoteAccess(sessionId, conectionType, isOneTime) {
    if (!sessionId) {
      throw 'SessionId is required';
    }
    if (!conectionType) {
      throw 'conectionType is required';
    }
    if (isOneTime) {
      this.devicesService.getSessionId(sessionId, conectionType).subscribe((realSessionId:any) => {
        console.log("realSessionId",realSessionId);
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
   // modalRef.componentInstance.data = null;
   /*
    let counter = 0;
    let  message = 'Wait until the connection is established... ';
     var modalInstance = $uibModal.open(modalParams);
     var promise;
     var remoteConnectPort;
     var restServerAddress;
     var url;
   
   
   
     //$rootScope.launchRemoteApp = function() {
       promise = setInterval(function () {
         counter++;
       }, 1000);
       remoteConnectPort = this.constantsStateService.getConstant('remote.connect.port'),
         restServerAddress = this.constantsStateService.getConstant('rest.server.address'),
         url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + realSessionId;
       modalInstance.result.then(angular.noop, function () {
         if (promise) {
           $interval.cancel(promise);
         }
       });
       DevicesService.subscribeToRemoteConnection(realSessionId, function () {
         if (modalInstance) {
           modalInstance.dismiss();
         }
         if (promise) {
           $interval.cancel(promise);
         }
         $rootScope.currentRemoteSessionId = realSessionId;
       });
       window.open(url, '_self');
   //  }
      */
   
   }
}
