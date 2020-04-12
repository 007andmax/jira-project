import { Component, OnInit } from '@angular/core';
// @ts-ignore
import { UpgradeModule } from "@angular/upgrade/static";
import { setUpLocationSync } from '@angular/router/upgrade';

import { UsersService } from "./services/users/users.service";
import { WebsocketService } from "./services/websocket/websocket.service";
import { UsersStateService } from './states/users/users-state.service';
import { DevicesSateService } from './states/devices/devices-sate.service';
import { CompaniesStateService } from './states/company/companies-state.service';
import { AppService } from './states/app/app.service';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from "@angular/common";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonHttpServices } from './components/device/_services/common_http.service';
import { RemoteControlService } from './components/device/_services/remoteControl.service';
import { CommonServices } from './components/device/_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { HardwareService } from './components/device/_services/hardware.service';
import { DeviceDetailService } from './components/device/_services/device_detail.service';
import { first } from 'rxjs/operators';


/**
 * Root component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isDevice = false;
  title = 'quck-device';
  totalSeconds:any = 0;
  totalMinutes:any = 0;
  totalHours:any = 0;
  loading:boolean = false;
  mainCompanyUuid: string = '9eb35e10-e243-4c07-baf0-c234fcd93766';
  deviceDetail: any = {};
  restServerAddress = '';
  remoteConnectPort = 0;
  modalRef: BsModalRef;
  /**
   * Creates an instance of the MainComponent with the injected services
   * @param {UpgradeModule} upgrade service
   * @param {UsersService} userService service
   * @param {WebsocketService} websocketService service
   */
  constructor(
    private upgrade: UpgradeModule,
    private userService: UsersService,
    private usersStateService: UsersStateService,
    private websocketService: WebsocketService,
    private devicesState: DevicesSateService,
    private companiesState: CompaniesStateService,
    private appService: AppService,
    public router: Router,
    private route: ActivatedRoute,
    private location: Location,

    private modalService: BsModalService, private commonHttpServices: CommonHttpServices,
    private commonServices: CommonServices, private toastr: ToastrService,
    private hardwareService: HardwareService,
    private deviceDetailService: DeviceDetailService, 
    private remoteControlService: RemoteControlService
  ) {
   }

  /**
   * Initializes root. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.router.events.subscribe(val => {
      if (this.location.path().includes('/device') === true) {
        this.isDevice = true;
      } else {
        this.isDevice = false;
      }
    });
    this.upgrade.bootstrap(document.body, ['quicktech']);
    setUpLocationSync(this.upgrade);
    this.devicesState.onInit();
    this.usersStateService.onInit();
    this.companiesState.onInit();
    //  this.userService.getCurrentUser();
    this.websocketService.initializeWebSocketConnection();
    this.appService.onCheckMobile();
    window.addEventListener('resize', this.appService.onCheckMobile);

    if (this.isDevice === true) {
      this.getCurrentCompany();
    
      setInterval(() => {
        this.updateTime();
      },1000);
    }

  }

  // Below code is for only device module

  getCurrentCompany() {
	
    this.commonHttpServices.getCurrentCompany()
    .pipe(first())
    .subscribe(
      resp => {
        localStorage.setItem('currentCompany', resp.id);
        if (localStorage.getItem('currentCompany') === undefined || localStorage.getItem('currentCompany') === null) {
          localStorage.setItem('currentCompany', this.mainCompanyUuid);
        }
        
        this.getDevicesByCompany();
      },
      error => {
      this.toastr.error('Something went wrong please try again.');
      }
    );
  }

  getDeviceDetail() {
	
    this.hardwareService.getAllHardwareList(localStorage.getItem('company_id'), this.deviceDetail.agentId)
    .pipe(first())
    .subscribe(
      resp => {
        this.deviceDetailService.addDevice(resp);
      },
      error => {
      this.toastr.error('Something went wrong please try again.');
      }
    );
  }

  updateTime() {
    this.totalSeconds++;
    if (parseInt(this.totalSeconds) === 60) {
      this.totalSeconds = 0;
      this.totalMinutes++;
    }
    if (this.totalMinutes === 60) {
      this.totalMinutes = 0;
      this.totalHours++;
    }
  }

  getDevicesByCompany() {
    this.commonHttpServices.getDevicesByCompany(localStorage.getItem('currentCompany'))
      .pipe()
      .subscribe(resp => {
        const tempObj = this.commonServices.cleanObject(resp);
        let deviceList = [];
        for (let key of Object.keys(tempObj)) {
          for (let key1 of Object.keys(tempObj[key])) {
            deviceList.push(tempObj[key][key1]);
          }
        }
        this.deviceDetailService.addDeviceList(deviceList);
        this.deviceDetail = tempObj[Object.keys(tempObj)[0]][0];
        localStorage.setItem('deviceDetail', JSON.stringify(tempObj[Object.keys(tempObj)[0]][0]))
        localStorage.setItem('company_id', Object.keys(tempObj)[0]);
        // this.getDeviceDetail();
      },
      error => {
        this.toastr.error('Something went wrong please try again.');
      });
    }

    getViewer() {
      this.loading = true;
      this.remoteControlService.getViewer()
      .pipe()
      .subscribe(resp => {
        this.loading = false;
      },
      error => {
        console.log('Something went wrong please try again.');
      });
    }

    getConstant(sessionId) {
      this.remoteControlService.getConstant()
      .pipe()
      .subscribe(resp => {
        this.restServerAddress = resp['rest.server.url'];
        this.remoteConnectPort = resp['remote.connect.port'];
        let url = 'quicktech://connect?serverIP=' + this.restServerAddress + '&port=' + this.remoteConnectPort + '&sessionID=' + sessionId;
        window.open(url, '_self');
      },
      error => {
        console.log('Something went wrong please try again.');
      });
    }

    createConnection(type) {
      this.loading = true;
      let data = {
        deviceId: this.deviceDetail.id,
        type: type,
        companyId: localStorage.getItem('company_id')
      };
      this.remoteControlService.createConnection(data)
      .pipe()
      .subscribe(resp => {
        this.loading = false;
        if (type === 'CSS') {
          this.modalRef.hide();
          this.getViewer();
        } else {
          this.getConstant(resp.sessionId);
          
        }
        
      },
      error => {
        this.toastr.error('Something went wrong please try again.');
      });
    }

  padNumber (value) {
    if(value == 0) {
      return '00';
    } else if (value < 10) {
      return '0' + value;
    }
    return value;
  }
  

}
