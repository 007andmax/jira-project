import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DeviceFilter } from 'src/app/components/devices/class/devices';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_DEVICE_MODEL } from 'src/app/const/confirm';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DeviceSettingStateService } from 'src/app/states/device-setting/device-setting-state.service';

@Component({
  selector: 'device-setting-model',
  templateUrl: './device-setting-model.component.html',
  styleUrls: ['./device-setting-model.component.scss']
})
export class DeviceSettingModelComponent implements OnInit {
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
  filter: DeviceFilter = new DeviceFilter();
  @Output() onSelectManufactureId = new EventEmitter();
  constructor(private companiesStateService: CompaniesStateService,
    private deviceSettingStateService: DeviceSettingStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private agentService: AgentService,) { }

  ngOnInit() {
    if (this.companiesStateService.getCurrentCompany()) {
      this.techCompany = this.companiesStateService.getCurrentCompany();
      this.getModels(this.companiesStateService.getCurrentCompany().id);
    }
    this.companiesStateService.onCurrentCompany.subscribe((data) => {
      this.techCompany = data;
      this.getModels(this.techCompany.id);
    })
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
    if (this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getModels(TechCompanyGuid);
      }, 300);
      return;
    }
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
}
