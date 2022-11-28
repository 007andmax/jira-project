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
  selectManufactureList: any[] = [];
  modelList: any[] = [];
  showPreloader: boolean = true;
  techCompany: any;
  model: any;
  manufactureId;
  searchModel: string;
  manufactureIsActiveList: any[] = [];
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
      this.getManufacturers(this.techCompany.id);
    }
    this.companiesStateService.onCurrentCompany.subscribe((data) => {
      this.techCompany = data;
      this.getModels(this.techCompany.id);
      this.getManufacturers(this.techCompany.id);
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_DEVICE_MODEL) this.removeModel();
      }
    })
    this.sub.add(getConfirm);
  }
  addModel(data) {
    this.modelList.push(data);
  }
  getManufacturers(TechCompanyGuid: any) {
    if (this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getManufacturers(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService.getManufactures(TechCompanyGuid)
      .subscribe((resp) => {
        this.manufactureIsActiveList = [];
        resp.forEach(element => {
          if (element.IsActive == true)
            this.manufactureIsActiveList.push(element)
        })
      });
  }
  onSelectManufactureName(SelectManufacturer) {
    if (SelectManufacturer) {
      this.onSelectManufactureId.emit(SelectManufacturer.ID);
      this.agentService.getModelsByManufacturer(SelectManufacturer.ID).subscribe((resp) => {
        this.selectManufactureList = resp;
      })
    }
    else {
      this.getModels(this.techCompany.id);
    }
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
