import { Component, OnInit } from '@angular/core';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { ContractsComponent } from '../../billing/contracts/contracts.component';

@Component({
  selector: 'app-company-contracts',
  templateUrl: './company-contracts.component.html',
  styleUrls: ['./company-contracts.component.scss']
})
export class CompanyContractsComponent extends ContractsComponent implements OnInit {
  companyContracts: Company = null;


  ngOnInit() {
    this.leftPanelStateService.setCompanyPage("company-contracts");
    if (localStorage.getItem('company_id')) {
      let company_id = localStorage.getItem('company_id');
      this.companyContracts = this.companiesStateService.getCompanies().find(item => item.id === company_id);

    }
    let getOnShowNotificationReview = this.contractsStateService.getOnShowNotificationReview().subscribe(data => {
      this.showNotificationReview = true;
    })
    this.sub.add(getOnShowNotificationReview);
    let getOnToggleCreate = this.contractsStateService.getOnToggleCreate().subscribe(data => {
      this.showCreate = data;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnToggleCreate);
    let getOnPreview = this.contractsStateService.getOnPreview().subscribe(data => {
      this.serviceAgreement = data;
      this.showPreview = true;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnPreview);
    let getOnTogglePreview = this.contractsStateService.getOnTogglePreview().subscribe(data => {

      this.showPreview = false;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnTogglePreview);
    let getOnEdit = this.contractsStateService.getOnEdit().subscribe(data => {
      this.serviceAgreement = data;
      this.showEdit = true;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnEdit);
    let getOnToggleEdit = this.contractsStateService.getOnToggleEdit().subscribe(data => {

      this.showEdit = data;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnToggleEdit);
  }

}
