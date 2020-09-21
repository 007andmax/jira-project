import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ContractsUserDevice } from '../class/contracts-user-device';
import { ContractsUserDeviceValidate } from '../class/contracts-user-device-validate';

@Component({
  selector: 'app-contracts-aside-user-device-billing',
  templateUrl: './contracts-aside-user-device-billing.component.html',
  styleUrls: ['./contracts-aside-user-device-billing.component.scss']
})
export class ContractsAsideUserDeviceBillingComponent implements OnInit {
  selectedType = new ContractsFilterType('Service Contract/by device/by user', 'SERVICE_CONTRACT_DEVICE_USER',null);
  contractsUserDevice: ContractsUserDevice = new ContractsUserDevice();
  formatDate: string = FORMAT_DATE_2;
  startDate = new Date().getTime();
  reviewDate = new Date().getTime();
  validate: ContractsUserDeviceValidate = new ContractsUserDeviceValidate();
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  minStartDate: number = null;
  constructor(private companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    let today = new Date();
    today.setMonth(today.getMonth() + 1);
    this.contractsUserDevice.setStartDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.contractsUserDevice.setReviewDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

    this.minStartDate = this.getMinStartDate('MONTHLY', this.contractsUserDevice.startDate);
  }
  onSelectCompany(data) {
    this.contractsUserDevice.setCompanyId((data) ? data.id : null);
  }
  onChangeStartDate(data) {
    this.contractsUserDevice.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  onChangeReviewDate(data) {
    this.contractsUserDevice.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  getMinStartDate(interval, startDate) {
    let newMinStartDate;
    let now = new Date(startDate);
    let n = new Date(now);
    let day = 1000 * 60 * 60 * 24;
    if (interval === 'MONTHLY') {
      n.setMonth(n.getMonth() - 1);
      newMinStartDate = n.getTime() + day;
    } else if (interval === 'YEARLY') {
      n.setFullYear(n.getFullYear() - 1);
      newMinStartDate = n.getTime() + day;
    } else if (interval === '30 days') {
      newMinStartDate = now.getTime() - (29 * day);
    } else if (interval === '15 days') {
      newMinStartDate = now.getTime() - (14 * day);
    } else if (interval === '7 days') {
      newMinStartDate = now.getTime() - (6 * day);
    }
    return newMinStartDate;
  }
  onSelectInterval(data) {
    this.selectedInterval = data;
    this.minStartDate = this.getMinStartDate(data, this.contractsUserDevice.startDate);
    console.log("this.minStartDate", this.minStartDate);
    this.contractsUserDevice.setInterval(data);
    this.contractsUserDevice.calculateEndDate();
    this.cd.detectChanges();
    console.log("this.contractsBlockTime.includedHours", this.contractsUserDevice);
  }
}
