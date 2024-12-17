import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CrmCompanyJobTitle } from 'src/app/components/setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { UserCustomerCompaniesInfo } from 'src/app/components/users/class/user-customer-companies-info';
import { UserDefaultSubscription } from 'src/app/components/users/class/user-default-subscription';
import { UserProfile } from 'src/app/components/users/class/user-profile';
import { UserRole } from 'src/app/components/users/class/user-role';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { CompanyAndressContact } from 'src/app/interfaces/company/company-address-contact';
import { UsersService } from 'src/app/services/users/users.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CustomerRoleStateService } from 'src/app/states/customer-role/customer-role-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-users-details-tab-companies-add',
  templateUrl: './users-details-tab-companies-add.component.html',
  styleUrls: ['./users-details-tab-companies-add.component.scss']
})
export class UsersDetailsTabCompaniesAddComponent implements OnInit {
  customerCompaniesInfo: UserCustomerCompaniesInfo = new UserCustomerCompaniesInfo();
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  sub: Subscription = new Subscription();
  userRoles: Array<UserRole> = [];
  defaultSubscriptions: UserDefaultSubscription = new UserDefaultSubscription(null);
  @ViewChild('userRolesDP') userRolesDP: DropDownComponent;
  @Input() user: UserProfile = new UserProfile();
  @Output() onClose = new EventEmitter<any>();
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  public primaryContact: CompanyAndressContact;
  public primaryPhone: Array<any>;
  constructor(private crmStateService: CrmStateService,
    public customerRoleStateService: CustomerRoleStateService,
    public usersStateService: UsersStateService,
    private usersService: UsersService,
    private companiesStateService: CompaniesStateService,
  ) { }

  ngOnInit() {
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
        primaryPhone = [];
      if (this.getCpmpany().companyInfo) {
        if (this.getCpmpany().companyInfo.contacts) {
          for (let contact of this.getCpmpany().companyInfo.contacts) {
            if (!primaryContact || contact.priority > primaryContact.priority) primaryContact = contact;
          }
        }
        if (this.getCpmpany().companyInfo.addresses) {
          for (let address of this.getCpmpany().companyInfo.addresses) {
            if (address.isPrimary) primaryAddress = address;
            primaryPhone = [...primaryPhone, ...address.phoneNumbers];
            primaryPhone.forEach(element => {
              if (element.number[0] === "1") element.number = `+${element.number}`;
            });
          }
        }
      }
      this.primaryContact = primaryContact;
      this.primaryPhone = primaryPhone;
    }
  }
  getCpmpany() {
    return this.companiesStateService.getCompanies().find(item => item.id == this.customerCompaniesInfo.companyId);
  }
  onSelectCompany(data) {
    this.customerCompaniesInfo.setCompanyId(data.id);
    this.customerCompaniesInfo.setClientCompanyName(data.name);
  }
  onSelectJobTitle(data) {
    this.customerCompaniesInfo.setJobTitleDto(data);
  }
  onChangeDefaultSubscriptions(data) {
    this.customerCompaniesInfo.setDefaultSubscriptions(data);
  }
  onSelectPortalAccessStatus(data) {
    this.customerCompaniesInfo.setUserRole(data);
  }
  addCompany() {
    if (!this.customerCompaniesInfo.companyId) return;
    this.addBtn.setDisabled(true);
    this.user.customerCompaniesInfo.push(this.customerCompaniesInfo);
    this.usersService.updateUser(this.user.getUserForUpdate(this.usersStateService.getuserForEdit())).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.onClose.emit(null);
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
}
