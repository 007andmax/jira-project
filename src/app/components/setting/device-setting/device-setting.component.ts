import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { DeviceFilter } from '../../devices/class/devices';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { DeviceSettingStateService } from 'src/app/states/device-setting/device-setting-state.service';
import { DeviceSettingDeviceTypeComponent } from './device-setting-device-type/device-setting-device-type.component';
import { DeviceSettingManufactureComponent } from './device-setting-manufacture/device-setting-manufacture.component';
import { DeviceSettingModelComponent } from './device-setting-model/device-setting-model.component';

@Component({
  selector: 'device-setting',
  templateUrl: './device-setting.component.html',
  styleUrls: ['./device-setting.component.scss']
})
export class DeviceSettingComponent implements OnInit {
  devicebutton: boolean = false;
  manufacturebutton: boolean;
  modelbutton: boolean;
  techCompany: any;
  manufactureId: Number;
  @ViewChild("deviceType") deviceType: DeviceSettingDeviceTypeComponent;
  @ViewChild("manufacture") manufacture: DeviceSettingManufactureComponent;
  @ViewChild("model") model: DeviceSettingModelComponent;
  addDeviceType: boolean = false;
  addManufacture: boolean = false;
  addModel: boolean = false;
  activeTab: string = "tab1";
  constructor(private settingStateService: SettingStateService,
    private agentService: AgentService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private ngZone: NgZone,
    private modalService: NgbModal,
    private companiesService: CompaniesService,
    private companiesStateService: CompaniesStateService,
    private deviceSettingStateService: DeviceSettingStateService,
    private companiesState: CompaniesStateService) { }

  ngOnInit() {
    this.companiesState.onInit();
    this.devicebutton = true;
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    this.settingStateService.setComponentName('DeviceSettingComponent');
    this.companiesStateService.onCurrentCompany.subscribe((data) => {
      if (data) {
        this.techCompany = data;
      }
    })
  }
  onClosedAddManufacture() {
    this.addManufacture = false;
  }
  onClosedAddModel() {
    this.addModel = false;
    this.manufactureId = null;
  }
  onAddModel(res) {
    this.model.addModel(res);
  }
  onClosedAddDeviceType() {
    this.addDeviceType = false;
  }
  onAddDeviceType(res) {
    this.deviceType.addDeviceType(res);
  }
  onAddManufacture(res) {
    this.manufacture.addManufacture(res);
  }
  toggle(evt: any) {
    this.activeTab = evt['nextId'];
    if (evt.nextId == "tab1") {
      this.devicebutton = true;
    }
    else {
      this.devicebutton = false
    }
    if (evt.nextId == "tab2") {
      this.manufacturebutton = true;
    }
    else {
      this.manufacturebutton = false
    }
    if (evt.nextId == "tab3") {
      this.modelbutton = true;
    }
    else {
      this.modelbutton = false
    }
  }

  openModel() {
    this.addDeviceType = true;
  }

  openModelManufacture() {
    this.addManufacture = true;
  }

  onSelectManufactureId(data) {
    this.manufactureId = data;
  }
  openModelPopup() {
    this.addModel = true;
  }
  ngOnDestroy() {
    $('body').removeClass('page-settings');
  }
}
