import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DeviceFilter } from 'src/app/components/devices/class/devices';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_DEVICE_MANUFACTURE } from 'src/app/const/confirm';
import { AgentService } from 'src/app/services/agent/agent.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DeviceSettingStateService } from 'src/app/states/device-setting/device-setting-state.service';

@Component({
  selector: 'device-setting-manufacture',
  templateUrl: './device-setting-manufacture.component.html',
  styleUrls: ['./device-setting-manufacture.component.scss']
})
export class DeviceSettingManufactureComponent implements OnInit {
  manufactureIsActiveList: any[] = [];
  techCompany: any;
  showPreloader: boolean = true;
  manufacturerList: any[] = [];
  manufacturer: any;
  filter: DeviceFilter = new DeviceFilter();
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private deviceSettingStateService: DeviceSettingStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private agentService: AgentService,) { }

  ngOnInit() {
    if (this.companiesStateService.getCurrentCompany()) {
      this.techCompany = this.companiesStateService.getCurrentCompany();
      this.getManufacturers(this.companiesStateService.getCurrentCompany().id);
    }
    this.companiesStateService.onCurrentCompany.subscribe((data) => {
      this.techCompany = data;
      this.getManufacturers(this.techCompany.id);
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_DEVICE_MANUFACTURE) this.removeManufacturer();
      }
    })
    this.sub.add(getConfirm);
  }
  addManufacture(data) {
    this.manufacturerList.push(data);
  }
  onFilterManufacturer(field) {
    this.filter.onFilter(field, this.manufactureIsActiveList)
  }
  getManufacturers(TechCompanyGuid: any) {
    this.showPreloader = true;
    if (this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getManufacturers(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService.getManufactures(TechCompanyGuid)
      .subscribe((resp) => {
        this.showPreloader = false;
        this.manufactureIsActiveList = [];
        this.manufacturerList = resp;

        this.manufacturerList.forEach(element => {
          if (element.IsActive == true)
            this.manufactureIsActiveList.push(element)
        })
      });
  }
  counterPopupManufactuer(manufacture) {
    this.deviceSettingStateService.openAsige({
      name: manufacture.Name, techCompanyGuid: this.techCompany.id, id: manufacture.ID,
      type: "MANUFACTURE"
    })
  }
  removeConfirmManufacturer(manufacturer: any) {
    this.manufacturer = manufacturer;
    this.confirmStateService.setConfirmAction(DELETE_DEVICE_MANUFACTURE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Delete Manufacturer`;
  }
  removeManufacturer() {
    this.manufacturer.IsActive = false;
    this.agentService
      .deleteManufacturer(this.manufacturer)
      .subscribe((resp) => {
        this.getManufacturers(this.techCompany.id)
      });
  }
}
