import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Subscription } from 'rxjs';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CompanyProfile } from '../../class/company-profile';
import { CompanySetting } from '../../class/company-setting';
import { CompanyValdiate } from '../../class/company-validate';

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
  sub: Subscription = new Subscription();
  constructor(private companiesService: CompaniesService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
  }
  public onChangeName() {
    if (this.company.name && this.company.name.length > 0) {
      let checkCompanyName = this.companiesService.checkCompanyName("", this.company.name).subscribe((data: any) => {
        if (data.value) {
          this.validate.resetName();
          this.validate.resetNameIsExist();
        } else {
          this.validate.setNameIsExist();
        }
      })
      this.sub.add(checkCompanyName);
    } else {
      this.validate.checkValidName(this.company.name);
    }
  }
  public onSelectCompanyTypes(type) {
    this.company.clientType = type.value;
    this.validate.resetType();
    this.onChangeType();
  }
  public onChangeType() {
    this.validate.checkValidType(this.company.clientType);
  }
  public onChangeDomain() {
    this.validate.checkValidDomain(this.company.domain);
    if (this.validate.getDomain()) {
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
  public onChangeFirstName() {
    this.validate.checkValidFirstname(this.company.contacts[0].firstName);
  }
  public onChangePhoneNumber() {
    this.validate.checkValidPhoneNumber(this.company.addresses[0].phoneNumbers[0].number);
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
