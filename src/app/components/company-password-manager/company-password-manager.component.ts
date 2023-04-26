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
  container = document.body.querySelector(".main-container");
  companyId: string;
  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.leftPanelStateService.changeStateWithoutNavigate('company-password-manager');
    this.companyId = this.activateRoute.snapshot.params['id'];
    if (this.companyId) this.companiesStateService.setCompanyRoutingId(this.companyId);
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      this.companyId = params['id'];
      if (this.companyId) this.companiesStateService.setCompanyRoutingId(this.companyId);
      this.filter.setCompany({ id: this.companyId });
      this.filter.setSort('CATEGORY');
      this.onScroll();
    });
    this.sub.add(subscription);

    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_RECORD) this.onRemoveRecord(this.passwordManagerStateService.getRecordForRemove().id);
      }
    })
    this.sub.add(getConfirm);
    let geLefttFilter = this.passwordManagerStateService.getOnFilter().subscribe((data) => {
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.filter.setFilter(data);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(geLefttFilter);
    let onChangeRealTime = this.passwordManagerStateService.onChangeRealTime.subscribe(newChange => {
      if (newChange.action === 'PASSWORD_RECORD_CREATED' && newChange.data.companyId === this.companiesStateService.getCompanyRoutingId()) {
        this.list_records.push(new PasswordRecord(newChange.data));
      } else if (newChange.action === 'PASSWORD_RECORD_UPDATED') {
        let indexList = this.list_records.findIndex(item => item.id === newChange.data.id);
        if (indexList > -1) this.list_records[indexList].onUpdate(newChange.data);
      } else if (newChange.action === 'PASSWORD_RECORD_DELETED') {
        let indexList = this.list_records.findIndex(item => item.id === newChange.data.id);
        if (indexList > -1) this.list_records.splice(indexList, 1);
      }
      if (!this.cd['destroyed']) this.cd.detectChanges();
    })
    this.sub.add(onChangeRealTime);
    if (this.passwordManagerStateService.getCategories().length === 0) this.passwordManagerStateService.onInit();
  }
  public ngOnDestroy() {
    this.sub.unsubscribe();
    this.companiesStateService.setCompanyRoutingId(null);
  }
}
