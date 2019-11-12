import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompanyAndressContact } from 'src/ng2/app/interfaces/company/company-address-contact';
import { CompanyAndress } from 'src/ng2/app/interfaces/company/company-address';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { DevicesSateService } from 'src/ng2/app/states/devices/devices-sate.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { DownloadAgentStateService } from 'src/ng2/app/states/download-agent/download-agent-state.service';
import { DownloadAgentComponent } from '../download-agent/download-agent.component';
import { CompanyProfile } from '../class/company-profile';

@Component({
  selector: 'app-companies-table',
  templateUrl: './companies-table.component.html',
  styleUrls: ['./companies-table.component.scss']
})
export class CompaniesTableComponent implements OnInit, OnDestroy {

  @Input() company: Company;

  public primaryContact: CompanyAndressContact;
  public primaryAddress: CompanyAndress;
  public primaryPhone: any;
  public location: string = '';
  public countUsers: number = 0;
  public countDevices: number = 0;
  public showArchivedCompanies: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService, private companiesStateService: CompaniesStateService,
    private devicesState: DevicesSateService, private modalService: NgbModal,
    private confirmStateService: ConfirmStateService,
    private companiesService: CompaniesService,
    private downloadAgentStateService:DownloadAgentStateService) { }

  ngOnInit() {

    this.companiesStateService.getOnShowArchived().subscribe(data => {
      this.showArchivedCompanies = true;
    })
    if (this.usersStateService.getAllUsers().length > 0) {
      this.onGetUsersCount(this.usersStateService.getAllUsers());
    } else {
      this.usersStateService.getOnUsers().subscribe((data) => {
        this.showArchivedCompanies = false;
        this.onGetUsersCount(data);
      })
    }
    if (this.devicesState.getAllDevices()) {
      this.onGetDevicesCount(this.devicesState.getAllDevices());
    } else {
      this.devicesState.getOnDevices().subscribe((data) => {
        this.showArchivedCompanies = false;
        this.onGetDevicesCount(data);
      })
    }
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
  downloadAgent() {
    this.downloadAgentStateService.setCompnay(this.company);
    const modalRef = this.modalService.open(DownloadAgentComponent, { windowClass: 'xs-modal' });
    
  }
  edit() {
    this.companiesService.getCompany(this.company.id).subscribe((data:CompanyProfile) =>{
      this.companiesStateService.setEditCompany(data);
    })
   
  }
  remove() {
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });

    modalRef.componentInstance.message = `Do you want to archive ${this.company.name}? All related users and service agreements will be archived and all agents will be uninstalled.`;
    this.companiesStateService.setCompnayForArchive(this.company);
  }
  private onGetDevicesCount(data) {
    
    let devices = data;
    this.countDevices = (devices[this.company.id]) ? devices[this.company.id].length : 0;
  }
  private onGetUsersCount(data) {

    let users = data;
    this.countUsers = users.filter((user) => {
      var isArchived = user.deletedAt || this.company.deletedAt;
      return !isArchived && !this.showArchivedCompanies && user.company.id === this.company.id || this.showArchivedCompanies && isArchived && user.company.id === this.company.id;
    }).length;
  }
   
  getUserName() {
    return `${this.primaryContact.firstName} ${this.primaryContact.lastName}`;
  };
  getCompanyLogoUrl() {
    if (this.company && this.company.logo && this.company.logo && this.company.logo.base64 && !this.company.logo.cropped) {
      return this.company.logo.base64;
    } else if (!(this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id)) {
      return '/company/default/logo.jpg';
    }
    return `/file/${this.company.logo.cropped.id}.jpg?t=${(this.company.logo.updatedAt ? this.company.logo.updatedAt :
      '')}`;
  };
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
