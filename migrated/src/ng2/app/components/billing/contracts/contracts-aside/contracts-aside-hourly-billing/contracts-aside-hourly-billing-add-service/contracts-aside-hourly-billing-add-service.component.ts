import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { DefaultServices } from '../../../../default-services/class/default-service';
import { Subscription } from 'rxjs';
import { DefaultServiceValidate } from '../../../../default-services/class/default-service-validate';
import { Tax } from 'src/ng2/class/taxes/tax';
import { DisabledBtnDirective } from 'src/ng2/app/directives/disabled-btn.directive';
import { SelectSearchComponent } from 'src/ng2/app/components/shared/select-search/select-search.component';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import * as moment from "moment";
import { ContractsHourly } from '../../class/contracts-hourly';
import { DefaultServicesHourlyContract } from '../../class/default-service-hourly-contract';
@Component({
  selector: 'app-contracts-aside-hourly-billing-add-service',
  templateUrl: './contracts-aside-hourly-billing-add-service.component.html',
  styleUrls: ['./contracts-aside-hourly-billing-add-service.component.scss']
})
export class ContractsAsideHourlyBillingAddServiceComponent implements OnInit {
  service: DefaultServicesHourlyContract = new DefaultServicesHourlyContract();

  sub: Subscription = new Subscription();
  validate: DefaultServiceValidate = new DefaultServiceValidate();
  defaultSelectedTax: Array<Tax> = [];
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  @Input() contractsHourly: ContractsHourly;
  @Output() onClose = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  constructor(private taxesStateService: TaxesStateService,
    private defaultServicesService: DefaultServicesService) { }

  ngOnInit() {
    this.service.onInitForAdd();
    if (this.taxesStateService.getTaxes().length > 0) this.setDefaultTaxes(this.taxesStateService.getTaxes());
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.setDefaultTaxes(data);
    })
    this.sub.add(getOnTaxess);
  }
  onChangeName() {
    if (this.service.name.length > 3 && this.service.name.length < 100) this.validate.resetName();
    this.validate.resetDuplicateName();
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
    this.taxesStateService.setTaxesFromtEdit(taxes);
  }
  public searchDuplicatedServiceNames() {
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsHourly.startDate).format('DD MMM YYYY'),
      moment(this.contractsHourly.endDate).format('DD MMM YYYY'), this.contractsHourly.companyId, null, [this.service.name]).subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.add();
        } else {
          this.validate.setDuplicateName(false);
        }
      }, err => {
        this.validate.setDuplicateName(false);
      })
  }
  add() {
    console.log("this.service", this.service);
    if (!this.validate.isValidate(this.service)) return;
    this.addBtn.setDisabled(true);
    this.defaultServicesService.addService(this.service.getDataForAddDefault()).subscribe((data: any) => {
      this.addBtn.setDisabled(false);
      this.service.setVersionedId(data.versionedId);
      this.onAdd.emit(this.service);
      this.closed();
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
  onTaxesChange(data) {
    this.service.taxes = data;
  }
  closed() {
    this.onClose.emit(null);
  }
}
