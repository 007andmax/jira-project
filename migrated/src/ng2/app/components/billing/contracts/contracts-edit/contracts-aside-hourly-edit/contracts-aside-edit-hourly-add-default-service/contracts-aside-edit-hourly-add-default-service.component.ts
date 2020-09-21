import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DisabledBtnDirective } from 'src/ng2/app/directives/disabled-btn.directive';
import { Tax } from 'src/ng2/app/interfaces/service/tax';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { DefaultServiceValidate } from '../../../../default-services/class/default-service-validate';
import { ContractsHourly } from '../../../contracts-aside/class/contracts-hourly';
import { DefaultServicesHourlyContract } from '../../../contracts-aside/class/default-service-hourly-contract';
import * as moment from "moment";
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { DropDownComponent } from 'src/ng2/app/components/shared/drop-down/drop-down.component';
import { ContractsHourlyAddDefaultServiceValidate } from '../class/contracts-hourly-add-default-service-valdiate';
import { ServiceAgreement } from '../../../class/service-agreement';


@Component({
  selector: 'app-contracts-aside-edit-hourly-add-default-service',
  templateUrl: './contracts-aside-edit-hourly-add-default-service.component.html',
  styleUrls: ['./contracts-aside-edit-hourly-add-default-service.component.scss']
})
export class ContractsAsideEditHourlyAddDefaultServiceComponent implements OnInit {
  service: DefaultServicesHourlyContract = new DefaultServicesHourlyContract();
  sub: Subscription = new Subscription();
  validate: ContractsHourlyAddDefaultServiceValidate = new ContractsHourlyAddDefaultServiceValidate();
  defaultSelectedTax: Array<Tax> = [];
  defaultServices: Array<DefaultServicesHourlyContract> = [];

  @ViewChild('serviceDropDown') serviceDropDown: DropDownComponent;
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  @Input() contractsHourly: ServiceAgreement;
  @Output() onClose = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  constructor(private taxesStateService: TaxesStateService,
    private contractsStateService: ContractsStateService,
    private defaultServicesService: DefaultServicesService) { }

  ngOnInit() {
    this.service.onInitForAdd();
    if (this.taxesStateService.getTaxes().length > 0) this.setDefaultTaxes(this.taxesStateService.getTaxes());
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.setDefaultTaxes(data);
    })
    this.sub.add(getOnTaxess);
    if (this.contractsStateService.getDefaultService().length > 0) this.defaultServices = this.contractsStateService.getDefaultService();
    this.defaultServices.sort((a, b) => a.name.localeCompare(b.name));
    this.contractsStateService.getOnDefaultServices().subscribe(data => {
      this.defaultServices = data.map(item => new DefaultServicesHourlyContract(item));
      this.defaultServices.sort((a, b) => a.name.localeCompare(b.name));
    })
    console.log("this.defaultServices", this.defaultServices);
  }
  onChangeName() {
    if (this.service.name.length > 3 && this.service.name.length < 100) this.validate.resetName();
    this.validate.resetDuplicateName();
  }
  selectService(data) {
    this.validate.resetDuplicateName();
    this.validate.resetValidate();
    if (data) {
      this.service = new DefaultServicesHourlyContract(JSON.parse(JSON.stringify(data)));
    } else {
      this.service = new DefaultServicesHourlyContract();
      this.service.taxes = this.defaultSelectedTax;
    }
   
  }
  onChangeRate(event) {
    this.service.rate = Number(event.target.value);
    console.log("this.service.rate", this.service.rate);
    if (this.service.rate >= 0) this.validate.resetRate();
  }
  private setDefaultTaxes(lsitTaxes) {
    let taxes = lsitTaxes.filter(item => item.isDefault === true);
    this.service.taxes = taxes;
    this.defaultSelectedTax = taxes;
    this.service.taxes = this.defaultSelectedTax;
    this.taxesStateService.setTaxesFromtEdit(taxes);
  }
  public searchDuplicatedServiceNames() {
    console.log("searchDuplicatedServiceNames");
    this.service.name = this.serviceDropDown.getInputText();
    if (this.service.name.length === 0)  {
      this.validate.setName(false);
      return;
    }
    let find = this.defaultServices.find(item => item.name === this.service.name);
    if (find) this.service.versionedId = find.versionedId;
    this.validate.resetDuplicateName();
    this.validate.resetValidate();
    if (!this.validate.isValidate(this.service) || !this.checkDuplicatedContractService()) {

      console.log("this.validate", this.validate);
      return
    };
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsHourly.startDate).format('DD MMM YYYY'),
      moment(this.contractsHourly.endDate).format('DD MMM YYYY'), this.contractsHourly.companyId, this.contractsHourly.id, [this.service.name]).subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.add();
        } else {
          this.validate.setValidate(false);
        }
      }, err => {
        this.validate.setValidate(false);
      })
  }
  checkDuplicatedContractService() {
    let find = this.contractsHourly.services.find(item => item.name === this.service.name);
    if (find) this.validate.setDuplicateName(false);
    console.log("find", find);
    return (find) ? false : true;
  }
  checkDuplicatedService() {
    let find = this.defaultServices.find(item => item.name === this.service.name);
    if (find) this.validate.setDuplicateName(false);
    console.log("find", find);
    return (find) ? false : true;
  }
  add() {
    console.log("serviceDropDown", this.serviceDropDown.getInputText());

    console.log("this.service", this.service);
    if (this.checkDuplicatedService()) {
      this.addBtn.setDisabled(true);
      this.defaultServicesService.addService(this.service.getDataForAddDefault()).subscribe((data: any) => {
        this.addBtn.setDisabled(false);
        this.service.setVersionedId(data.versionedId);
        this.onAdd.emit(this.service);
        this.closed();
      }, err => {
        this.addBtn.setDisabled(false);
      })
    } else {
      this.onAdd.emit(this.service);
    }

  }
  onTaxesChange(data) {
    this.service.taxes = data;
  }
  closed() {
    this.onClose.emit(null);
  }
}
