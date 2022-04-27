import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELETE_CRM_INDUSTRIES, DELETE_CRM_JOB_TITLIES, DELETE_CRM_JOB_TYPIES, DELETE_CRM_SERVICE_TYPIES } from 'src/app/const/confirm';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { CrmCompanyIndustryComponent } from './crm-company-industry/crm-company-industry.component';
import { CrmCompanyJobTitleComponent } from './crm-company-job-title/crm-company-job-title.component';
import { CrmCompanyJobTypeComponent } from './crm-company-job-type/crm-company-job-type.component';
import { CrmCompanyServiceTypeComponent } from './crm-company-service-type/crm-company-service-type.component';

@Component({
  selector: 'crm-settings',
  templateUrl: './crm-settings.component.html',
  styleUrls: ['./crm-settings.component.scss']
})
export class CrmSettingsComponent implements OnInit, OnDestroy {
  activeTab: string = "companyIndustry";
  @ViewChild("industry") industry: CrmCompanyIndustryComponent;
  @ViewChild("jobTitle") jobTitle: CrmCompanyJobTitleComponent;
  @ViewChild("serviceType") serviceType: CrmCompanyServiceTypeComponent;
  @ViewChild("jobType") jobType: CrmCompanyJobTypeComponent;
  constructor(private crmStateService: CrmStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal) { }

  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
  }
  parseAddText() {
    if (this.activeTab === "companyIndustry") return "Add Industry";
    if (this.activeTab === "userJobTitle") return "Add Job Title";
    if (this.activeTab === "serviceType") return "Add Service Type";
    if (this.activeTab === "jobType") return "Add User Type";
    return "";
  }
  create() {
    if (this.activeTab === "companyIndustry") this.industry.toggleShowAdd(true);
    if (this.activeTab === "userJobTitle") this.jobTitle.toggleShowAdd(true);
    if (this.activeTab === "serviceType") this.serviceType.toggleShowAdd(true);
    if (this.activeTab === "jobType") this.jobType.toggleShowAdd(true);
  }
  setTab(data) {
    this.activeTab = data['nextId'];
  }
  ngOnDestroy(): void {
    $('body').removeClass('ng7');
  }
  getSelectedCount() {
    if (this.activeTab === "companyIndustry") return this.crmStateService.getListIndustriesForRemove().length;
    if (this.activeTab === "userJobTitle") return this.crmStateService.getListJobTitleForRemove().length;
    if (this.activeTab === "serviceType") return this.crmStateService.getListServiceTypeForRemove().length;
    if (this.activeTab === "jobType") return this.crmStateService.getListJobTypeForRemove().length;

  }
  removeList() {
    if (this.activeTab === "companyIndustry") {
      this.confirmStateService.setConfirmAction(DELETE_CRM_INDUSTRIES);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
      modalRef.componentInstance.message = `Remove Industry`;

    }
    if (this.activeTab === "userJobTitle") {
      this.confirmStateService.setConfirmAction(DELETE_CRM_JOB_TITLIES);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
      modalRef.componentInstance.message = `Remove Job Title`;

    }
    if (this.activeTab === "serviceType") {
      this.confirmStateService.setConfirmAction(DELETE_CRM_SERVICE_TYPIES);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
      modalRef.componentInstance.message = `Remove Service Type`;

    }
    if (this.activeTab === "jobType") {
      this.confirmStateService.setConfirmAction(DELETE_CRM_JOB_TYPIES);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
      modalRef.componentInstance.message = `Remove Job Type`;

    }
  }
}
