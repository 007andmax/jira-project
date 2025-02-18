import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { NonContractServices } from '../../../../non-contract-services/class/non-contract-service';
import { ContractsOtherService } from '../../class/contracts-other-service';
import { DefaultServicesHourlyContract } from '../../class/default-service-hourly-contract';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contracts-aside-other-service',
  templateUrl: './contracts-aside-other-service.component.html',
  styleUrls: ['./contracts-aside-other-service.component.scss']
})
export class ContractsAsideOtherServiceComponent implements OnInit, OnDestroy {
  formatDate: string = FORMAT_DATE_2;
  @Input() service: ContractsOtherService;
  editItem: NonContractServices = null;
  @Output() onRemove = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  defaultServices: Array<DefaultServicesHourlyContract> = [];
  constructor(private contractsStateService: ContractsStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    let today = new Date();
    today.setMonth(today.getMonth() + 1);
    this.service.setDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

    if (this.contractsStateService.getDefaultService().length > 0) this.defaultServices = this.contractsStateService.getDefaultService().map(item => new DefaultServicesHourlyContract(item));
    this.defaultServices.sort((a, b) => a.name.localeCompare(b.name));
    let getOnDefaultServices = this.contractsStateService.getOnDefaultServices().subscribe(data => {
      this.defaultServices = data.map(item => new DefaultServicesHourlyContract(item));
      this.defaultServices.sort((a, b) => a.name.localeCompare(b.name));
    })
    this.sub.add(getOnDefaultServices);
    if (this.service.serviceId.length > 0) this.editItem = new NonContractServices(this.service);
  }
  public getHours() {
    let timeInMinutes = this.service.quantity * 60;
    return Math.floor(timeInMinutes / 60);

  }
  public getMinutes() {
    let timeInMinutes = this.service.quantity * 60;
    let hours = Math.floor(timeInMinutes / 60);
    return Math.round(timeInMinutes - (hours * 60));
  }
  public onChangeTaxSum() {
    let rate = this.service.taxes.map(item => item.rate).reduce((a, b) => a + b, 0);
    this.service.taxSum = this.service.rate * this.service.quantity * rate / 100;
  }
  public onChangeDescription() {
    this.service.resetValidateDescription();
  }
  public onChangeDurationService(data) {
    this.service.setQuantity(data);
    this.onChangeTaxSum();
  }
  select(data: NonContractServices) {
    this.editItem = data;
    this.service.setData(data);
    this.onChangeTaxSum();
  }
  onChangeDatePickerService(data) {
    this.service.setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  remove() {
    this.onRemove.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
