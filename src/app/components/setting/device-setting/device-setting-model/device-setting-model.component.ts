import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_DEVICE_MODEL } from 'src/app/const/confirm';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DeviceSettingStateService } from 'src/app/states/device-setting/device-setting-state.service';
import { DeviceSettingFilter } from '../Class/devicesetting-filter';

@Component({
  selector: 'device-setting-model',
  templateUrl: './device-setting-model.component.html',
  styleUrls: ['./device-setting-model.component.scss']
})
export class DeviceSettingModelComponent implements OnInit, OnDestroy {
  selectAllDevices: boolean = false;
  selectManufactureList: any[] = [];
  selectedDeviceModel: any[] = [];
  modelList: any[] = [];
  showPreloader: boolean = true;
  techCompany: any;
  model: any;
  manufactureId;
  searchModel: string;
  sub: Subscription = new Subscription();
  filter: DeviceSettingFilter = new DeviceSettingFilter();
  @Output() onSelectManufactureId = new EventEmitter();
  constructor(private companiesStateService: CompaniesStateService,
    private deviceSettingStateService: DeviceSettingStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private agentService: AgentService,) { }

  ngOnInit() {
    if (this.companiesStateService.getCurrentCompany()) {
      this.techCompany = this.companiesStateService.getCurrentCompany();
      if (this.agentService.hasAccessToken()) this.getModels(this.companiesStateService.getCurrentCompany().id);
    }
    let onCurrentCompany = this.companiesStateService.onCurrentCompany.subscribe((data) => {
      this.techCompany = data;
      if (this.agentService.hasAccessToken()) this.getModels(this.techCompany.id);
    })
    this.sub.add(onCurrentCompany);
    let onSetAccessToken = this.agentService.onSetAccessToken.subscribe(data => {
      if (this.techCompany) this.getModels(this.techCompany.id);
    })
    this.sub.add(onSetAccessToken);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_DEVICE_MODEL) this.removeModel();
      }
    })
    this.sub.add(getConfirm);
  }
  getSelectedCount() {
    return this.selectedDeviceModel.length;
  }
  getSelectedDeviceModel() {
    return this.selectedDeviceModel;
  }
  toogleDevices(isChecked: boolean) {
    this.modelList.forEach((item) => {
      item.selected = this.selectAllDevices ? true : false;
    });
    if (isChecked) {
      this.modelList.forEach((element, index) => {
        this.selectedDeviceModel.push(this.modelList[index]);
      })
    }
    else {
      this.selectedDeviceModel = [];
    }
  }
  onSelect(index: number, isChecked: boolean) {
    let find = this.modelList.find((item) => !item.selected);
    this.selectAllDevices = find ? false : true;
    if (isChecked) {
      this.selectedDeviceModel.push(this.modelList[index]);
    } else {
      let Id = this.modelList[index].ID;
      let Index = this.selectedDeviceModel.findIndex(item => item.ID == Id);
      this.selectedDeviceModel.splice(Index, 1);
    }
  }
  addModel(data) {
    this.modelList.push(data);
  }
  removeModel() {
    this.model.IsActive = false;
    this.agentService
      .deleteModel(this.model)
      .subscribe((resp) => {
        this.getModels(this.techCompany.id)

      });
  }
  getModels(TechCompanyGuid: any) {
    this.showPreloader = true;
    this.agentService
      .getModels(TechCompanyGuid)
      .subscribe((resp) => {
        this.showPreloader = false;
        this.selectManufactureList = resp;
        this.modelList = resp;

        this.modelList.forEach(element => {
          if (element.IsActive == true) {
            this.selectManufactureList.push(element);
          }
        })

      });
  }
  counterPopupModel(model) {
    this.deviceSettingStateService.openAsige({
      name: model.Name, techCompanyGuid: this.techCompany.id, id: model.ID,
      type: "MODEL"
    })
  }
  onFilterModel(field) {
    this.filter.onFilter(field, this.selectManufactureList)
  }
  removeConfirmModel(model: any) {
    this.model = model;
    this.confirmStateService.setConfirmAction(DELETE_DEVICE_MODEL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Delete Model`;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
