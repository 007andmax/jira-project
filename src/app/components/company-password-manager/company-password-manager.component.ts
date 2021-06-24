import { Component } from '@angular/core';
import { PasswordManagerComponent } from '../password-manager/password-manager.component';
import { PasswordRecord } from '../password-manager/class/password-record';
import { PasswordManagerListService } from '../password-manager/services/password-manager-list.service';
import { REMOVE_RECORD } from '../../const/confirm';


@Component({
  selector: 'company-password-manager',
  templateUrl: './company-password-manager.component.html',
  styleUrls: ['./company-password-manager.component.scss'],
  providers: [PasswordManagerListService]
})
export class CompanyPasswordManagerComponent extends PasswordManagerComponent {

  companyId: string;
  ngOnInit() {
    window.scrollTo(0, 0);
    this.leftPanelStateService.changeStateWithoutNavigate('company-password-manager');
    this.companyId = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      this.companyId = params['id'];
      this.companiesStateService.setSelectedCompanyId(this.companyId);
      this.getRecords();
    });
    this.sub.add(subscription);

    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_RECORD) this.onRemoveRecord(this.passwordManagerStateService.getRecordForRemove().id);
      }
    })
    this.sub.add(getConfirm);
    let geLefttFilter = this.passwordManagerStateService.getOnFilter().subscribe((data) => {
      window.scrollTo(0, 0);
      this.filter.setFilter(data);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(geLefttFilter);
    let onChangeRealTime = this.passwordManagerStateService.onChangeRealTime.subscribe(newChange => {
      if (newChange.action === 'PASSWORD_RECORD_CREATED' && newChange.data.companyId === this.companiesStateService.getSelectedCompanyId()) {
        this.recordsData.push(new PasswordRecord(newChange.data));
        if (this.passwordManagerListService.getBlockList()) this.list_records.push(new PasswordRecord(newChange.data));
      } else if (newChange.action === 'PASSWORD_RECORD_UPDATED') {
        let index = this.recordsData.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.recordsData[index] = new PasswordRecord(newChange.data);
        let indexList = this.list_records.findIndex(item => item.id === newChange.data.id);
        if (indexList > -1) this.list_records[indexList] = new PasswordRecord(newChange.data);
      } else if (newChange.action === 'PASSWORD_RECORD_DELETED') {
        let index = this.recordsData.findIndex(item => item.id === newChange.data.id);
        let indexList = this.list_records.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.recordsData.splice(index, 1);
        if (indexList > -1) this.list_records.splice(indexList, 1);
      }
      if (!this.cd['destroyed']) this.cd.detectChanges();
    })
    this.sub.add(onChangeRealTime);
    if (this.passwordManagerStateService.getCategories().length === 0) this.passwordManagerStateService.onInit();
  }

  public getRecords() {
    this.passwordManagerService.getCompanyRecords(this.companyId).subscribe((res: any) => {
      this.filter.setCompany(this.companiesStateService.getCompanies().find(item => item.id == this.companyId));
      this.recordsData = res.map(item => new PasswordRecord(item));
      this.recordsData.sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
        1 : ((b.companyName.toLowerCase() > a.companyName.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      this.onScroll();
      this.cd.detectChanges();
    });
  }
}
