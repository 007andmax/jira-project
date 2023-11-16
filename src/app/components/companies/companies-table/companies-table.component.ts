import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Company } from 'src/app/interfaces/company/company';
import { CompanyAndressContact } from 'src/app/interfaces/company/company-address-contact';
import { CompanyAndress } from 'src/app/interfaces/company/company-address';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DownloadAgentStateService } from 'src/app/states/download-agent/download-agent-state.service';
import { DownloadAgentComponent } from '../download-agent/download-agent.component';
import { CompanyProfile } from '../class/company-profile';
import { DEARCHIVE_COMPANY, ARCHIVE_COMPANY } from 'src/app/const/confirm';
import { AppService } from 'src/app/states/app/app.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { Router } from '@angular/router';
import { CompanyItem } from '../class/company-item';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompanyDeviceCount } from '../class/company-device-count';

@Component({
  selector: 'app-companies-table',
  templateUrl: './companies-table.component.html',
  styleUrls: ['./companies-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesTableComponent implements OnInit, OnDestroy {
  @Input() company: CompanyItem;
  @Input() public showArchivedCompanies: boolean = false;
  @Input() devicesCounts: Array<CompanyDeviceCount> = [];
  @Output() onSelectCompany = new EventEmitter<any>();
  public primaryContact: CompanyAndressContact;
  public primaryAddress: CompanyAndress;
  public primaryPhone: any;
  public location: string = '';
  public countUsers: number = 0;
  public countDevices: number = 0;
  IS_MOBILE: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    public companiesStateService: CompaniesStateService,
    private devicesState: DevicesStateService,
    private modalService: NgbModal,
    private confirmStateService: ConfirmStateService,
    private companiesService: CompaniesService,
    private downloadAgentStateService: DownloadAgentStateService,
    private appService: AppService,
    private router: Router,
    public cd: ChangeDetectorRef,
    private draftEmailStateService: DraftEmailStateService,
    private permissionsService: PermissionsService,
    private elRef: ElementRef) { }

  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0) this.onGetUsersCount(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.showArchivedCompanies = false;
      this.onGetUsersCount(data);
      this.cd.markForCheck();
    })
    this.sub.add(getOnUsers);
    this.IS_MOBILE = this.appService.checkMobile();
    this.cd.markForCheck();
    let getOnMobile = this.appService.getOnMobile().subscribe(data => {
      this.IS_MOBILE = data;
      this.cd.markForCheck();
    })
    this.sub.add(getOnMobile);
  }
  ngDoCheck() {
    if (this.company) {
      let primaryContact,
        primaryAddress,
        primaryPhone;
      if (this.company.companyInfo) {
        if (this.company.companyInfo.contacts) {
          for (let contact of this.company.companyInfo.contacts) {
            if (!primaryContact || contact.priority > primaryContact.priority) primaryContact = contact;
          }
        }
        if (this.company.companyInfo.addresses) {
          for (let address of this.company.companyInfo.addresses) {
            if (address.isPrimary) primaryAddress = address;
          }
        }
        if (primaryAddress && primaryAddress.phoneNumbers.length) {
          primaryPhone = primaryAddress.phoneNumbers[0];
          if (primaryPhone.number[0] === "1") primaryPhone.number = `+${primaryPhone.number}`;
        }
      }
      this.primaryContact = primaryContact;
      this.primaryAddress = primaryAddress;
      this.primaryPhone = primaryPhone;
      if (primaryAddress) {
        this.location = primaryAddress.addressWithSuitNumberAndPostalCode;
      } else {
        this.location = '';
      }
      this.devicesCounts
    }
  }
  getDeviceCount() {
    return this.devicesCounts.find(item => item.companyId === this.company.id) ? this.devicesCounts.find(item => item.companyId === this.company.id).count : 0;
  }
  checkLogo() {
    return (this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id || this.company && this.company.logo && this.company.logo.origin && this.company.logo.origin.id)
  }

  getPhoneNumner() {
    return (this.primaryPhone && this.primaryPhone.number) ? this.primaryPhone.number : '';
  }
  getCompanyDashboardLink() {
    return `company/${this.company.id}/dashboard`;
  }
  goToDashboard() {
    if (this.appService.checkMobile()) {
      this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/company/`, this.company.id, 'dashboard']);
    } else {
      const url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/company/${this.company.id}/dashboard`;
      window.open(url, '_blank');
    }
    this.cd.detectChanges();
  }
  getUserName() {
    return (this.primaryContact) ? `${this.primaryContact.firstName} ${this.primaryContact.lastName}` : '';
  };
  downloadAgent() {
    this.downloadAgentStateService.setCompnay(this.company);
    const modalRef = this.modalService.open(DownloadAgentComponent, { windowClass: 'download-modal', backdrop: 'static', keyboard: false });
    this.cd.detectChanges();
  }
  edit() {
    let getCompany = this.companiesService.getCompany(this.company.id).subscribe((data: CompanyProfile) => {
      this.companiesStateService.setEditCompany(data);
      this.cd.detectChanges();
    })
    this.sub.add(getCompany);
  }
  remove() {
    this.confirmStateService.setConfirmAction(ARCHIVE_COMPANY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to archive ${this.company.name}? All related users and service agreements will be archived and all agents will be uninstalled.`;
    this.companiesStateService.setCompnayForArchive(this.company);
    this.cd.detectChanges();
  }
  private onGetUsersCount(data) {
    let users = data;
    this.countUsers = users.filter((user) => {
      var isArchived = user.deletedAt || this.company.deletedAt;
      return !isArchived && !this.showArchivedCompanies && user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.company.id) || this.showArchivedCompanies && isArchived && user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.company.id);
    }).length;
    this.cd.markForCheck();
  }

  selectCompany(event) {
    if (event.target.checked) {
      this.draftEmailStateService.addSelectedCompany(this.company);
    } else {
      let list = this.draftEmailStateService.getSelectedCompanies();
      let index = list.findIndex(item => item.id === this.company.id);
      if (index > -1) this.draftEmailStateService.removeSelectedCompany(index);
    }
    this.onSelectCompany.emit(this.company);
    this.cd.detectChanges();
  }
  onRestore() {
    this.confirmStateService.setConfirmAction(DEARCHIVE_COMPANY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to restore ${this.company.name}?`;
    this.companiesStateService.setCompnayForDeArchive(this.company);
    this.cd.detectChanges();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
