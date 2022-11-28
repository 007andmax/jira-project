import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DeviceFilter } from 'src/app/components/devices/class/devices';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_DEVICE_TYPE } from 'src/app/const/confirm';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DeviceSettingStateService } from 'src/app/states/device-setting/device-setting-state.service';

@Component({
  selector: 'device-setting-device-type',
  templateUrl: './device-setting-device-type.component.html',
  styleUrls: ['./device-setting-device-type.component.scss']
})
export class DeviceSettingDeviceTypeComponent implements OnInit {
  hardwareTypes: any[] = [];
  deviceTypeList: any[] = [];
  filter: DeviceFilter = new DeviceFilter();
  techCompany: any;
  showPreloader: boolean = true;
  deviceType: any;
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private deviceSettingStateService: DeviceSettingStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private agentService: AgentService,) { }

  ngOnInit() {
    if (this.companiesStateService.getCurrentCompany()) {
      this.techCompany = this.companiesStateService.getCurrentCompany();
      this.getDeviceTypes(this.companiesStateService.getCurrentCompany().id);
    }
    this.companiesStateService.onCurrentCompany.subscribe((data) => {
      this.techCompany = data;
      this.getDeviceTypes(this.techCompany.id);
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_DEVICE_TYPE) this.removeDeviceType();
      }
    })
    this.sub.add(getConfirm);
  }
  addDeviceType(data) {
    this.hardwareTypes.push(data);
  }
  removeDeviceType() {
    this.deviceType.IsActive = false;
    this.agentService
      .deleteHardwareType(this.deviceType)
      .subscribe((resp) => {
        this.getDeviceTypes(this.techCompany.id);
      });
  }
  onFilter(field) {
    this.filter.onFilter(field, this.deviceTypeList);
  }
  getDeviceTypes(TechCompanyGuid: any) {
    this.showPreloader = true;
    if (this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getDeviceTypes(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService
      .getHardwareTypeByTechCompanyGuid(TechCompanyGuid)
      .subscribe((resp) => {
        this.showPreloader = false;
        this.deviceTypeList = [];
        this.hardwareTypes = resp;

        this.hardwareTypes.forEach(element => {
          if (element.IsActive == true) {
            this.deviceTypeList.push(element);
          }
        })
      });
  }
  counterPopup(deviceType) {
    this.deviceSettingStateService.openAsige({
      name: deviceType.Name, techCompanyGuid: this.techCompany.id, id: deviceType.ID,
      type: "HARDWARE"
    })
  }
  removeConfirm(deviceType: any) {
    this.deviceType = deviceType;

    this.confirmStateService.setConfirmAction(DELETE_DEVICE_TYPE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Delete DeviceType`;
  }
}
