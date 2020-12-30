import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompanyAndressContact } from 'src/ng2/app/interfaces/company/company-address-contact';
import { CompanyAndress } from 'src/ng2/app/interfaces/company/company-address';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { DownloadAgentStateService } from 'src/ng2/app/states/download-agent/download-agent-state.service';
import { DownloadAgentComponent } from '../download-agent/download-agent.component';
import { CompanyProfile } from '../class/company-profile';
import { DEARCHIVE_COMPANY, ARCHIVE_COMPANY } from 'src/ng2/app/const/confirm';
import { AppService } from 'src/ng2/app/states/app/app.service';
import { DraftEmailStateService } from 'src/ng2/app/states/draft-email/draft-email-state.service';

@Component({
  selector: 'app-companies-table',
  templateUrl: './companies-table.component.html',
  styleUrls: ['./companies-table.component.scss']
})
export class CompaniesTableComponent implements OnInit, OnDestroy {

  @Input() company: Company;
  @Input() public showArchivedCompanies: boolean = false;
  public primaryContact: CompanyAndressContact;
  public primaryAddress: CompanyAndress;
  public primaryPhone: any;
  public location: string = '';
  public countUsers: number = 0;
  public countDevices: number = 0;
  IS_MOBILE: boolean = false;

  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    private companiesStateService: CompaniesStateService,
    private devicesState: DevicesStateService,
    private modalService: NgbModal,
    private confirmStateService: ConfirmStateService,
    private companiesService: CompaniesService,
    private downloadAgentStateService: DownloadAgentStateService,
    private appService: AppService,
    private draftEmailStateService: DraftEmailStateService,
    private elRef: ElementRef) { }

  ngOnInit() {
    /*  this.companiesStateService.getOnShowArchived().subscribe(data => {
        this.showArchivedCompanies = data;
      })*/
    if (this.usersStateService.getAllUsers().length > 0) this.onGetUsersCount(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.showArchivedCompanies = false;
      this.onGetUsersCount(data);
    })
    this.sub.add(getOnUsers);

    if (this.devicesState.getAllDevices()) this.onGetDevicesCount(this.devicesState.getAllDevices());
    let getOnDevices = this.devicesState.getOnDevices().subscribe((data) => {
      this.showArchivedCompanies = false;

      this.onGetDevicesCount(data);
    })
    this.sub.add(getOnDevices);

    this.IS_MOBILE = this.appService.checkMobile();
    let getOnMobile = this.appService.getOnMobile().subscribe(data => {
      this.IS_MOBILE = data;
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
        if (primaryAddress && primaryAddress.phoneNumbers.length) primaryPhone = primaryAddress.phoneNumbers[0];
      }
      this.primaryContact = primaryContact;
      this.primaryAddress = primaryAddress;
      this.primaryPhone = primaryPhone;

      if (primaryAddress) {
        this.location = primaryAddress.addressWithSuitNumberAndPostalCode;
      } else {
        this.location = '';
      }
    }
  }
  checkLogo() {
    return (this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id || this.company && this.company.logo && this.company.logo.origin && this.company.logo.origin.id)
  }

  goToDashboard() {

    localStorage.setItem("company_id", this.company.id);
    //  window.location.href = `#/tickets/user`;
    let body = document.querySelector('.left-panel__category-wrap');
    var link = document.createElement('a');
    body.appendChild(link);
    // link.href = `#/clients/companyProfile/${this.company.id}?tabName=dashboard`;
    link.href = `#/ng2/company/dashboard/${this.company.id}`
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);
  }
  showInfo() {
    if (this.IS_MOBILE) {
      this.elRef.nativeElement.querySelector('.new-companies-content__list--item').classList.toggle('show-details');
    }
  }
  getCompanyLogoUrl() {
    if (this.company && this.company.logo && this.company.logo && this.company.logo.base64 && !this.company.logo.cropped) return this.company.logo.base64;
    if (this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id) return `/file/${this.company.logo.cropped.id}`;
    if (this.company && this.company.logo && this.company.logo.origin && this.company.logo.origin.id) return `/file/${this.company.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }
  getUserName() {
    return `${this.primaryContact.firstName} ${this.primaryContact.lastName}`;
  };
  downloadAgent() {

    this.downloadAgentStateService.setCompnay(this.company);
    const modalRef = this.modalService.open(DownloadAgentComponent, { windowClass: 'download-modal' });

  }
  edit() {
    let getCompany = this.companiesService.getCompany(this.company.id).subscribe((data: CompanyProfile) => {

      this.companiesStateService.setEditCompany(data);
    })
    this.sub.add(getCompany);

  }
  remove() {
    this.confirmStateService.setConfirmAction(ARCHIVE_COMPANY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to archive ${this.company.name}? All related users and service agreements will be archived and all agents will be uninstalled.`;
    this.companiesStateService.setCompnayForArchive(this.company);
  }
  private onGetDevicesCount(data) {

    let devices = data;

    this.countDevices = (devices && devices[this.company.id]) ? devices[this.company.id].length : 0;

  }
  private onGetUsersCount(data) {

    let users = data;
    this.countUsers = users.filter((user) => {
      var isArchived = user.deletedAt || this.company.deletedAt;
      return !isArchived && !this.showArchivedCompanies && user.company.id === this.company.id || this.showArchivedCompanies && isArchived && user.company.id === this.company.id;
    }).length;
  }

  onSelectCompany(event) {

    if (event.target.checked) {
      this.draftEmailStateService.addSelectedCompany(this.company);
    } else {
      let list = this.draftEmailStateService.getSelectedCompanies();
      let index = list.findIndex(item => item.id === this.company.id);
      if (index > -1) this.draftEmailStateService.removeSelectedCompany(index);
    }

  }
  onRestore() {
    this.confirmStateService.setConfirmAction(DEARCHIVE_COMPANY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to restore ${this.company.name}?`;
    this.companiesStateService.setCompnayForDeArchive(this.company);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
