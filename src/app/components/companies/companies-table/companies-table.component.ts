import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CompanyAndressContact } from 'src/app/interfaces/company/company-address-contact';
import { CompanyAndress } from 'src/app/interfaces/company/company-address';
import { UsersStateService } from 'src/app/states/users/users-state.service';
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
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { CompanyItem } from '../class/company-item';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompanyDeviceCount } from '../class/company-device-count';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-companies-table',
  templateUrl: './companies-table.component.html',
  styleUrls: ['./companies-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TicketsListService]
})
export class CompaniesTableComponent implements OnInit, OnDestroy {
  @Input() company: CompanyItem;
  @Input() public showArchivedCompanies: boolean = false;
  @Input() devicesCounts: Array<CompanyDeviceCount> = [];
  @Output() onSelectCompany = new EventEmitter<any>();
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  public primaryContact: CompanyAndressContact;
  public primaryAddress: CompanyAndress;
  public primaryPhone: any;
  public location: string = '';
  public countUsers: number = 0;
  public countDevices: number = 0;
  sub: Subscription = new Subscription();
  constructor(public usersStateService: UsersStateService,
    public companiesStateService: CompaniesStateService,
    private modalService: NgbModal,
    private confirmStateService: ConfirmStateService,
    private companiesService: CompaniesService,
    private downloadAgentStateService: DownloadAgentStateService,
    public cd: ChangeDetectorRef,
    private draftEmailStateService: DraftEmailStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public ticketsListService: TicketsListService,
    private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    if (this.usersStateService.getAllUsers().length > 0) this.onGetUsersCount(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.showArchivedCompanies = false;
      this.onGetUsersCount(data);
      this.cd.markForCheck();
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.showArchivedCompanies = false;
      this.onGetUsersCount(this.usersStateService.getAllUsers());
      this.cd.markForCheck();
    })
    this.sub.add(onChangeUsers);
  }
  ngDoCheck() {
    if (this.company) {
      let primaryContact,
        primaryAddress,
        notPrimaryAddress,
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
            if (!address.isPrimary) notPrimaryAddress = address;
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
      if (notPrimaryAddress) {
        this.location = notPrimaryAddress.addressWithSuitNumberAndPostalCode;
      } else {
        this.location = '';
      }
      this.devicesCounts
    }
  }
  parseClientType(clientType) {
    if (this.showArchivedCompanies) return 'Archive';
    return clientType ? clientType.toLowerCase() : '';
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
    const url = (!this.customerPortalStateService.isCustomerPortal) ? `/#/${this.companiesStateService.getCurrentCompany().techDomain}/company/${this.company.id}/dashboard` : `/#/${this.companiesStateService.getCurrentCompany().techDomain}/company/${this.company.id}/tickets`;
    window.open(url, '_blank');
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
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Archive Company`;
    modalRef.componentInstance.message = `All related users and service agreements will be archived and all
      agents will be uninstalled`;
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
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Restore Company`;
    modalRef.componentInstance.message = `Are you sure you want to restore ${this.company.name}?`;
    this.companiesStateService.setCompnayForDeArchive(this.company);
    this.cd.detectChanges();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
