import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CrmCompanyJobTitle } from 'src/app/components/setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { UserCustomerCompaniesDefaultSubscribtionAdd } from 'src/app/components/users/class/user-customer-companies-default-subscribtion-add';
import { UserCustomerCompaniesInfo } from 'src/app/components/users/class/user-customer-companies-info';
import { UserDefaultSubscription } from 'src/app/components/users/class/user-default-subscription';
import { UserProfile } from 'src/app/components/users/class/user-profile';
import { UserRole } from 'src/app/components/users/class/user-role';
import { Company } from 'src/app/interfaces/company/company';
import { CompanyAndressContact } from 'src/app/interfaces/company/company-address-contact';
import { UsersService } from 'src/app/services/users/users.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CustomerRoleStateService } from 'src/app/states/customer-role/customer-role-state.service';
import { UsersRealTimeService } from 'src/app/states/users/users-real-time.service';

@Component({
  selector: 'app-users-details-tab-companies-item',
  templateUrl: './users-details-tab-companies-item.component.html',
  styleUrls: ['./users-details-tab-companies-item.component.scss']
})
export class UsersDetailsTabCompaniesItemComponent implements OnInit, OnDestroy {
  @ViewChild('userRolesDP') userRolesDP: DropDownComponent;
  @Input() customerCompaniesInfo: UserCustomerCompaniesInfo;
  @Input() user: UserProfile = new UserProfile();
  @Output() onUpdate = new EventEmitter<any>();
  portalAccessList = ["Registered", "Invite sent", "Unauthorizeds"];
  selectedCompany: Company;
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  defaultSubscriptions: UserDefaultSubscription = new UserDefaultSubscription(null);
  public primaryContact: CompanyAndressContact;
  public primaryPhone: Array<any>;
  userRoles: Array<UserRole> = [];
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private crmStateService: CrmStateService,
    private usersService: UsersService,
    private usersRealTimeService: UsersRealTimeService,
    public cd: ChangeDetectorRef,
    public customerRoleStateService: CustomerRoleStateService,
  ) { }


  ngOnInit() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id == this.customerCompaniesInfo.companyId);
    this.defaultSubscriptions = this.customerCompaniesInfo.defaultSubscriptions;
    this.jobTitleList = this.crmStateService.getJobTitleList();
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.jobTitleList = data;
    })
    this.sub.add(onGetJobTitle);
    this.userRoles = this.customerRoleStateService.getUserRoles();
    let onGetUserRole = this.customerRoleStateService.onGetUserRole.subscribe(data => {
      this.userRoles = this.customerRoleStateService.getUserRoles();
      if (this.userRolesDP) this.userRolesDP.reset(this.userRoles);
    })
    this.sub.add(onGetUserRole);
  }
  ngDoCheck() {
    if (this.getCpmpany()) {
      let primaryContact,
        primaryAddress,
        primaryPhone;
      if (this.getCpmpany().companyInfo) {
        if (this.getCpmpany().companyInfo.contacts) {
          for (let contact of this.getCpmpany().companyInfo.contacts) {
            if (!primaryContact || contact.priority > primaryContact.priority) primaryContact = contact;
          }
        }
        if (this.getCpmpany().companyInfo.addresses) {
          for (let address of this.getCpmpany().companyInfo.addresses) {
            if (address.isPrimary) primaryAddress = address;
          }
        }
        if (primaryAddress && primaryAddress.phoneNumbers.length) {
          primaryPhone = primaryAddress.phoneNumbers;
          primaryPhone.forEach(element => {
            if (element.number[0] === "1") element.number = `+${element.number}`;
          });

        }
      }
      this.primaryContact = primaryContact;
      this.primaryPhone = primaryPhone;
    }
  }
  onSelectJobTitle(data) {
    this.customerCompaniesInfo.setJobTitleDto(data);
    this.onUpdate.emit(null);
  }
  onChangeDefaultSubscriptions(data) {
    this.usersService.setSubscriptions(
      {
        ...new UserCustomerCompaniesDefaultSubscribtionAdd(data.ticketSubscription.enabled,
          data.ticketManagerSubscription.enabled,
          data.invoiceSubscription.enabled,
          this.user.id,
          this.customerCompaniesInfo.companyId)
      }).subscribe(res => {
      })
  }
  onSelectPortalAccessStatus(data) {
    console.log("onSelectPortalAccessStatus", data);
    this.customerCompaniesInfo.setUserRole(data);
    this.onUpdate.emit(null);
  }
  getCpmpany() {
    return this.companiesStateService.getCompanies().find(item => item.id == this.customerCompaniesInfo.companyId);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
