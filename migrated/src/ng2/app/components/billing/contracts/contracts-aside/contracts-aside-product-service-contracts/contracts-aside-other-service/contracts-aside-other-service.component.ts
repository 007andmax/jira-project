import { Component, Input, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { DefaultServices } from '../../../../default-services/class/default-service';
import { ContractsOtherService } from '../../class/contracts-other-service';
import { DefaultServicesHourlyContract } from '../../class/default-service-hourly-contract';

@Component({
  selector: 'app-contracts-aside-other-service',
  templateUrl: './contracts-aside-other-service.component.html',
  styleUrls: ['./contracts-aside-other-service.component.scss']
})
export class ContractsAsideOtherServiceComponent implements OnInit {
  @Input() service: ContractsOtherService;
  defaultServices: Array<DefaultServicesHourlyContract> = [];
  constructor(private contractsStateService: ContractsStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    let today = new Date();
    today.setMonth(today.getMonth() + 1);
    this.service.setDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

    if (this.contractsStateService.getDefaultService().length > 0) this.defaultServices = this.contractsStateService.getDefaultService();
    this.defaultServices.sort((a, b) => a.name.localeCompare(b.name));
    this.contractsStateService.getOnDefaultServices().subscribe(data => {
      this.defaultServices = data.map(item => new DefaultServicesHourlyContract(item));
      this.defaultServices.sort((a, b) => a.name.localeCompare(b.name));
    })
  }
  public onChangeDescription() {
    this.service.resetValidateDescription();
  }
  public onChangeDurationService(data) {
    console.log("data", data);
    this.service.setQuantity(data);

  }
  select(data: DefaultServices) {
    console.log("data", data);
    this.service.name = data.name;
    this.service.description = "";
    this.service.quantity = 0;
    this.service.date = new Date().getTime();
    this.service.serviceId = data.versionedId.id;
    this.service.validate = true;
  }
  onChangeDatePickerService(data) {
    console.log("data", data);
    this.service.setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
 
  }
}
