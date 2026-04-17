import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CompanyProfile } from '../../class/company-profile';
import { CompanySetting } from '../../class/company-setting';
import { CompanyValdiate } from '../../class/company-validate';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UsersService } from 'src/app/services/users/users.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CrmCompanyJobTitle } from 'src/app/components/setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
var $ = require("jquery");

@Component({
  selector: 'company-add-aside-short',
  templateUrl: './company-add-aside-short.component.html',
  styleUrls: ['./company-add-aside-short.component.scss']
})
export class CompanyAddAsideShortComponent implements OnInit, OnDestroy {
  companyTypes = [new CompanySetting('Client', 'CLIENT'), new CompanySetting('Lead', 'LEAD'), new CompanySetting('Vendor', 'VENDOR'), new CompanySetting('Supplier', 'SUPPLIER')];
  @Input() validate: CompanyValdiate = new CompanyValdiate();
  @Input() company: CompanyProfile = new CompanyProfile();
  @Output() onInitFullVersion = new EventEmitter();
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  usersList = [];
  users = [];
  sub: Subscription = new Subscription();
  constructor(private companiesService: CompaniesService,
    private usersStateService: UsersStateService,
    private usersService: UsersService,
    private companiesStateService: CompaniesStateService,
    private crmStateService: CrmStateService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0) this.onGetUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetUsers(this.usersStateService.getAllUsers());
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.onGetUsers(this.usersStateService.getAllUsers());
    })
    this.sub.add(onChangeUsers);
    this.jobTitleList = this.crmStateService.getJobTitleList();
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.jobTitleList = data;
    })
    this.sub.add(onGetJobTitle);
  }
  onSelectJobTitle(data) {
    this.company.contacts[0].customerCompaniesInfo[0].setJobTitleDto(data);
  }
  public onChangeName() {
    if (this.company.name && this.company.name.length > 0) {
      let checkCompanyName = this.companiesService.checkCompanyName("", this.company.name).subscribe((data: any) => {
        this.validate.isChangingName = false;
        if (data.value) {
          this.validate.resetName();
          this.validate.resetNameIsExist();
          this.company.addresses[0].locationName = JSON.parse(JSON.stringify(this.company.name));
        } else {
          this.validate.setNameIsExist();
        }
      })
      this.sub.add(checkCompanyName);
    } else {
      this.validate.checkValidName(this.company.name);
    }
  }
  onCheckPrimaryNumber() {
    this.validate.checkValidPrimaryPhoneNumber(this.company.contacts[0].phoneNumbers[0].number);
  }
  onSelectUser(item) {
    if (item) {
      this.company.contacts[0].setId(item.id);
      this.validate.resetUser();
    } else {
      this.company.contacts[0].setId(null);
    }
  }
  onGetUsers(data) {
    this.users = data.filter(item => {
      if (item.accountType !== 'TECH' && !item.deletedAt) {
        return item;
      }
    });
    this.usersList = this.getUserList();
  }
  getUserList() {
    return this.users.map(item => {
      return `${item.firstName} ${item.lastName}`
    }).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
  }
  public onSelectCompanyTypes(type) {
    if (type) this.company.clientType = type.value;
    this.validate.resetType();
    this.onChangeType();
  }
  public onChangeType() {
    this.validate.checkValidType(this.company.clientType);
  }
  public onChangeDomain() {
    this.validate.resetDomainIsExist();
    this.validate.checkValidDomain(this.company.domain);
    if (this.validate.getDomain() && this.validate.getDomainValid()) {
      this.companiesService.checkCompanyDomain('', this.company.domain).subscribe((data: any) => {
        if (data.value) {
          this.validate.resetDomain();
          this.validate.resetDomainIsExist();
        } else {
          this.validate.setDomainIsExist();
        }
        this.cd.detectChanges();
      })
    }
  }
  onCheckEmail() {
    if (this.company.contacts[0].primaryEmail && this.company.contacts[0].primaryEmail.length > 0) this.onCheckValidPrimaryEmail();
  }
  onCheckValidPrimaryEmail() {
    this.validate.setIsCheckingEmail(true);
    this.usersService.checkValidPrimaryEmail(this.company.contacts[0].primaryEmail, this.companiesStateService.getCurrentCompany().id).subscribe((data: any) => {
      this.validate.setExistPrimaryContactEmail(data.value);
      this.validate.setIsCheckingEmail(false);
      this.cd.detectChanges();
    })
  }
  public onChangeFirstName() {
    this.validate.checkValidFirstname(this.company.contacts[0].firstName);
  }
  public onChangePhoneNumber() {
    this.validate.checkValidShippingPhoneNumber(this.company.addresses[0].phoneNumbers[0].number);
  }
  public onChangePrimaryEmail() {
    this.validate.checkValidPrimaryEmail(this.company.contacts[0].primaryEmail);
  }
  initFullVersion() {
    this.onInitFullVersion.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
