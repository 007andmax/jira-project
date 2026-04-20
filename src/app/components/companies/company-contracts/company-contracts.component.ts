import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/interfaces/company/company';
import { ContractsComponent } from '../../billing/contracts/contracts.component';
import { ContractsEditComponent } from '../../billing/contracts/contracts-edit/contracts-edit.component';
import { ContractsAsideComponent } from '../../billing/contracts/contracts-aside/contracts-aside.component';
import { ContractsPreviewComponent } from '../../billing/contracts/contracts-preview/contracts-preview.component';
import { ContractsTableComponent } from '../../billing/contracts/contracts-table/contracts-table.component';
import { ContractsHeaderComponent } from '../../billing/contracts/contracts-header/contracts-header.component';
import { NgIf } from '@angular/common';
import { ContractsReviewComponent } from '../../billing/contracts/contracts-review/contracts-review.component';

@Component({
    selector: 'app-company-contracts',
    templateUrl: './company-contracts.component.html',
    styleUrls: ['./company-contracts.component.scss'],
    standalone: true,
    imports: [ContractsReviewComponent, NgIf, ContractsHeaderComponent, ContractsTableComponent, ContractsPreviewComponent, ContractsAsideComponent, ContractsEditComponent]
})
export class CompanyContractsComponent extends ContractsComponent implements OnInit {
  companyContracts: Company = null;
  showNotificationReview: boolean = false;
  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.leftPanelStateService.changeStateWithoutNavigate("company-contracts");
    let id = this.activateRoute.snapshot.params['id'];
    if (id) this.companiesStateService.setCompanyRoutingId(id);
    let subscription = this.activateRoute.params.subscribe(params => {
      id = params['id'];
      if (id) this.companiesStateService.setCompanyRoutingId(id);
      this.companyContracts = this.companiesStateService.getCompanies().find(item => item.id === id);
    });
    this.sub.add(subscription);
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe(res => {
      this.companyContracts = res.find(item => item.id === id);
    })
    this.sub.add(getOnCompanies);
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.companiesStateService.setCompanyRoutingId(null);
  }
}
