import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { DeviceSettingStateService } from 'src/app/states/device-setting/device-setting-state.service';
import { DeviceSettingDeviceTypeComponent } from './device-setting-device-type/device-setting-device-type.component';
import { DeviceSettingManufactureComponent } from './device-setting-manufacture/device-setting-manufacture.component';
import { DeviceSettingModelComponent } from './device-setting-model/device-setting-model.component';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { FormBuilder } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  activeTab: string = "manufacture";
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
    // this.companiesState.onInit();
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
    if (evt.nextId == "deviceType") {
      this.devicebutton = true;
    }
    else {
      this.devicebutton = false
    }
    if (evt.nextId == "manufacture") {
      this.manufacturebutton = true;
    }
    else {
      this.manufacturebutton = false
    }
    if (evt.nextId == "model") {
      this.modelbutton = true;
    }
    else {
      this.modelbutton = false
    }
  }
  getSelectedCount() {
    if (this.deviceType) return this.deviceType.getSelectedCount();
    if (this.manufacture) return this.manufacture.getSelectedCount();
    if (this.model) return this.model.getSelectedCount();
  }
  openModel() {
    this.addDeviceType = true;
  }
  removeList() {
    if (this.activeTab == "deviceType") {
      this.deviceType.showPreloader = true;
      forkJoin(this.deviceType.getSelectedDeviceType().map(item => this.agentService.deleteHardwareType(item).pipe(map((res) => res),
        catchError(error => of(undefined)))))
        .subscribe(
          () => {
            this.deviceType.selectedDeviceType = [];
            this.deviceType.getDeviceTypes(this.techCompany.id);
          },
          error => {
            this.toastrService.error("Something went wrong please try again.");
          }
        );
    }
    if (this.activeTab == "manufacture") {
      this.manufacture.showPreloader = true;
      forkJoin(this.manufacture.getSelectedDeviceManufacturer().map(item => this.agentService.deleteManufacturer(item).pipe(map((res) => res),
        catchError(error => of(undefined)))))
        .subscribe(
          () => {
            this.manufacture.selectedDeviceManufacturer = [];
            this.manufacture.getManufacturers(this.techCompany.id);
          },
          error => {
            this.toastrService.error("Something went wrong please try again.");
          }
        );
    }
    if (this.activeTab == "model") {
      this.model.showPreloader = true;
      forkJoin(this.model.getSelectedDeviceModel().map(item => this.agentService.deleteModel(item).pipe(map((res) => res),
        catchError(error => of(undefined)))))
        .subscribe(
          () => {
            this.model.selectedDeviceModel = [];
            this.model.getModels(this.techCompany.id);
          },
          error => {
            this.toastrService.error("Something went wrong please try again.");
          }
        );
    }
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
