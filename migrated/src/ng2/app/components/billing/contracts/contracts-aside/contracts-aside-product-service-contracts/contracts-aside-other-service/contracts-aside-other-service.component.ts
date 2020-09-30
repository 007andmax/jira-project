import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
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
  formatDate: string = FORMAT_DATE_2;
  @Input() service: ContractsOtherService;
  editItem:DefaultServices = null;
  @Output() onRemove = new EventEmitter<any>();
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
    if (this.service.serviceId.length > 0) this.editItem = new DefaultServices(this.service);
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
  public onChangeDescription() {
    this.service.resetValidateDescription();
  }
  public onChangeDurationService(data) {
    console.log("data", data);
    this.service.setQuantity(data);

  }
  select(data: DefaultServices) {
    console.log("data", data);
    this.editItem = data;
    this.service.setData(data);
    
  }
  onChangeDatePickerService(data) {
    console.log("data", data);
    this.service.setDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
 
  }
  remove() {
    this.onRemove.emit(null);
  }
}
