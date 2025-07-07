import { ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemFilterPerson } from 'src/app/components/left-panel/left-panel-companies/class/item-filter-person';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ImageCropperStateService } from 'src/app/states/image-cropper/image-cropper-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CompanyProfile } from '../../class/company-profile';
import { CompanySetting } from '../../class/company-setting';
import { CompanyValdiate } from '../../class/company-validate';
import { } from 'google-maps';
import { CrmCompanyIndustry } from 'src/app/components/setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CrmCompanyServiceType } from 'src/app/components/setting/crm-settings/crm-company-service-type/class/crm-company-service-type';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { CrmCompanyJobTitle } from 'src/app/components/setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { CompanyProfileAddress } from '../../class/company-profile-address';
import { MODE_EDIT_SUBSCRIPTION, MODE_HIDE_ACTIVE } from 'src/app/const/users';
import { UsersService } from 'src/app/services/users/users.service';
import { CompanyUsersDropDownComponent } from 'src/app/components/tickets/tickets/ticket-add-aside/company-users-drop-down/company-users-drop-down.component';
import { TimeZone } from '../../company-time-zone/class/time-zone';
import { CompanyTimeZoneStateService } from '../../company-time-zone/services/company-time-zone-state.service';
import { ThirdPartyApp } from '../../class/company-third-party-apps';

@Component({
  selector: 'company-add-aside-full',
  templateUrl: './company-add-aside-full.component.html',
  styleUrls: ['./company-add-aside-full.component.scss']
})
export class CompanyAddAsideFullComponent implements OnInit, OnDestroy {
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  companyTypes = [new CompanySetting('Client', 'CLIENT'), new CompanySetting('Lead', 'LEAD'), new CompanySetting('Vendor', 'VENDOR'), new CompanySetting('Supplier', 'SUPPLIER')];
  paymentTerms = [new CompanySetting('COD', 0), new CompanySetting('7 days', 7), new CompanySetting('15 days', 15), new CompanySetting('30 days', 30), new CompanySetting('45 days', 45), new CompanySetting('60 days', 60)];
  paymentMethods = [new CompanySetting('Cash', 'CASH'),
  new CompanySetting('Cheque', 'CHEQUE'),
  new CompanySetting('Debit Card', 'DEBIT_CARD'),
  new CompanySetting('Credit Card', 'CREDIT_CARD'),
  new CompanySetting('Wire Transfer', 'WIRE_TRANSFER')];
  serviceTypes: Array<CrmCompanyServiceType> = [];
  @ViewChild('paymentTerm', { static: true }) paymentTerm: DropDownComponent;
  @ViewChild('paymentMethod', { static: true }) paymentMethod: DropDownComponent;
  @ViewChild('companyTypeDp', { static: true }) companyTypeDp: DropDownComponent;
  @ViewChild('userDp', { static: true }) userDp: CompanyUsersDropDownComponent;
  selectedTimeZone: TimeZone;
  industries: Array<CrmCompanyIndustry> = [];
  locationIsinit: boolean = false;
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  listPersons: Array<ItemFilterPerson> = [];
  idUploadFile: string;
  users = [];
  usersList = [];
  MODE_HIDE_ACTIVE = MODE_HIDE_ACTIVE;
  MODE_EDIT_SUBSCRIPTION = MODE_EDIT_SUBSCRIPTION;
  @Input() validate: CompanyValdiate = new CompanyValdiate();
  @Input() company: CompanyProfile = new CompanyProfile();
  @Input() serviceTypeDp: DropDownComponent;
  sub: Subscription = new Subscription();
  constructor(
    private usersStateService: UsersStateService,
    private imageCropperStateService: ImageCropperStateService,
    public cd: ChangeDetectorRef,
    private companiesService: CompaniesService,
    private crmStateService: CrmStateService,
    private usersService: UsersService,
    private companyTimeZoneState: CompanyTimeZoneStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.industries = this.crmStateService.getIndustryList();
    let onGetIndustry = this.crmStateService.onGetIndustry.subscribe(data => {
      this.industries = data;
    })
    this.sub.add(onGetIndustry);
    this.jobTitleList = this.crmStateService.getJobTitleList();
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.jobTitleList = data;
    })
    this.sub.add(onGetJobTitle);
    if (this.crmStateService.getServiceTypeList().length === 0) {
      this.crmStateService.onInitGetServiceTypeList();
    } else {
      this.serviceTypes = this.crmStateService.getServiceTypeList();
    }
    let onGetServiceType = this.crmStateService.onGetServiceType.subscribe(data => {
      this.serviceTypes = data;
      if (this.serviceTypeDp) this.serviceTypeDp.reset(this.serviceTypes);
    })
    this.sub.add(onGetServiceType);
    if (this.usersStateService.getAllUsers().length > 0) {
      this.getTechusers(this.usersStateService.getAllUsers());
      this.onGetUsers(this.usersStateService.getAllUsers());
    }
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getTechusers(data);
      this.onGetUsers(this.usersStateService.getAllUsers());
    })
    this.sub.add(getOnUsers);
    if (this.company.clientType) this.companyTypeDp.selectItemWithOutChanges(this.companyTypes.find(item => item.value == this.company.clientType));
    if (this.company.contacts[0].id) {
      let user = this.users.find(item => item.id == this.company.contacts[0].id);
      if (user) this.userDp.selectItemWithOutChanges({ user: user, customerCompany: user.customerCompaniesInfo[0] });
    }
    if (this.paymentTerm) this.paymentTerm.selectItemWithOutChanges(this.paymentTerms.find(item => item.value == this.companiesStateService.getCurrentCompany().paymentTerms));
    this.company.paymentTerms = JSON.parse(JSON.stringify(this.companiesStateService.getCurrentCompany().paymentTerms));

    if (this.companiesStateService.getCurrentCompany().defaultPaymentMethod) {
      this.paymentMethod.selectItemWithOutChanges(this.paymentMethods.find(item => item.value == this.companiesStateService.getCurrentCompany().defaultPaymentMethod));
      this.company.defaultPaymentMethod = JSON.parse(JSON.stringify(this.companiesStateService.getCurrentCompany().defaultPaymentMethod));
    }
    this.company.addresses[1].sameAsBilling = true;
    this.company.addresses[1].isPrimary = false;
    this.onCroppImage();
    if (this.companyTimeZoneState.getTimeZone().length > 0) this.setTimeZone(this.companyTimeZoneState.getTimeZone());
    if (this.companyTimeZoneState.getTimeZone().length == 0) this.companyTimeZoneState.onGetTimeZone();
    let onTimeZone = this.companyTimeZoneState.onTimeZone.subscribe(data => {
      this.setTimeZone(this.companyTimeZoneState.getTimeZone());
    })
    this.sub.add(onTimeZone);
  }
  setTimeZone(data) {
    let list = data.map(item => new TimeZone(item));
    this.selectedTimeZone = list.find(item => item.second === this.companiesStateService.getCurrentCompany().addresses[0].timeZone.name);
  }
  onGetUsers(data) {
    this.users = data.filter(item => {
      if (item.accountType !== 'TECH' && !item.deletedAt) return item;
    });
    this.usersList = this.getUserList();
  }
  getUserList() {
    return this.users.map(item => {
      return `${item.firstName} ${item.lastName}`
    }).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
  }
  public onCroppImage() {
    let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {
      if (data && this.company.logo) this.companiesService.removeAttachment(this.company.logo.origin.id).subscribe(res => {
      });
      if (data) this.company.setLogo(data);
      if (!data) this.companiesService.removeAttachment(this.idUploadFile).subscribe(res => {
      });
    })
    this.sub.add(getConfirm);
  }
  private getTechusers(list) {
    list.forEach((item) => {
      if (item.accountType === "TECH" && !item.deletedAt) {
        this.listPersons.push(new ItemFilterPerson(item.id, `${item.firstName} ${item.lastName}`));
        this.listPersons.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
          1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      }
    })
  }
  onChangeBillingLocationName(data) {
    if (this.company.addresses[1].sameAsBilling) {
      this.company.addresses[1].locationName = JSON.parse(JSON.stringify(this.company.addresses[0].locationName));
      this.validate.resetShippingAddress()
    }
    this.validate.resetBillindAddress();
  }

  onChangeBillingSuiteNo(data) {
    if (this.company.addresses[1].sameAsBilling) this.company.addresses[1].suiteNumber = JSON.parse(JSON.stringify(this.company.addresses[0].suiteNumber));
  }
  onChangeBillingZip(data) {
    if (this.company.addresses[1].sameAsBilling) this.company.addresses[1].postalCode = JSON.parse(JSON.stringify(this.company.addresses[0].postalCode));

  }
  addThirdParty() {
    this.company.thirdPartyApps.push(new ThirdPartyApp({
      appId: '',
      appName: ''
    }));
  }
  removeThirdParty(i) {
    this.company.thirdPartyApps.splice(i, 1);
  }
  onSameAsBilling(event) {
    if (event.target.checked) {
      this.company.addresses[1] = new CompanyProfileAddress(JSON.parse(JSON.stringify(this.company.addresses[0])));
      this.company.addresses[1].sameAsBilling = true;
      this.company.addresses[1].isPrimary = false;
      this.validate.resetShippingAddress();
      this.onChangeShippingPhoneNumber();
    }
  }
  removeLogo() {
    this.companiesService.removeAttachment(this.company.logo.origin.id).subscribe(data => {
      this.company.editLogo(null);
    })
  }
  public uploadFileOnBrower(event) {
    this.imageCropperStateService.uploadFileOnBrower(event).then((data: any) => {
      this.idUploadFile = data.id;
    })
  }
  onCheckPrimaryNumber() {
    this.validate.checkValidPrimaryPhoneNumber(this.company.contacts[0].phoneNumbers[0].number);
  }
  public onChangeName() {
    if (this.company.name && this.company.name.length > 0) {
      let checkCompanyName = this.companiesService.checkCompanyName("", this.company.name).subscribe((data: any) => {
        if (data.value) {
          this.validate.resetName();
          this.validate.resetNameIsExist();
          this.company.addresses[0].locationName = JSON.parse(JSON.stringify(this.company.name));
          this.validate.resetBillindAddress();
        } else {
          this.validate.setNameIsExist();
        }
      })
      this.sub.add(checkCompanyName);
    } else {
      this.validate.checkValidName(this.company.name);
    }
  }
  onSelectUser(item) {
    if (item) {
      this.company.contacts[0].setId(item.id);
      this.validate.resetUser();
    } else {
      this.company.contacts[0].setId(null);
    }
    this.validate.resetFirstName();
    this.validate.resetPrimaryContactEmail();
    this.validate.resetExistPrimaryContactEmail();
  }
  public onSelectCompanyTypes(type) {
    if (type) this.company.clientType = type.value;
    this.validate.resetType();
    this.onChangeType();
  }
  public onChangeType() {
    this.validate.checkValidType(this.company.clientType);
  }
  onSelectClientIndustry(item) {
    this.company.clientIndustry.name = (item) ? item.name : null;
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
  public onCheckGoogleAutoComplete(event, index) {
    if (event.target.getAttribute("location-is-init") == "false") this.getPlaceAutocomplete(event, index);
  }
  private getPlaceAutocomplete(event, index) {
    event.target.setAttribute("location-is-init", true);
    const autocomplete = new google.maps.places.Autocomplete(event.target,
      {
        componentRestrictions: null,
        types: ['address']  // 'establishment' / 'address' / 'geocode'
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();

      this.invokeEvent(place, event, index);
    });
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
  invokeEvent(place: any, event, index) {
    this.company.addresses[index].locationLat = place.geometry.location.lat();
    this.company.addresses[index].locationLng = place.geometry.location.lng();
    this.company.addresses[index].address = event.target.value;
    this.company.addresses[index].addressWithSuitNumberAndPostalCode = place.formatted_address;
    place.address_components.forEach(item => {
      if (item.types.indexOf('postal_code') !== -1) {
        this.company.addresses[index].postalCode = item.short_name;
      }
      if (item.types.indexOf('country') !== -1) {
        this.company.addresses[index].countryCode = item.short_name;
      }
      this.cd.detectChanges();
    })
    if (this.company.addresses[1].sameAsBilling && index == 0) {
      this.company.addresses[1].locationLat = JSON.parse(JSON.stringify(place.geometry.location.lat()));
      this.company.addresses[1].locationLng = JSON.parse(JSON.stringify(place.geometry.location.lng()));
      this.company.addresses[1].address = JSON.parse(JSON.stringify(event.target.value));
      this.company.addresses[1].addressWithSuitNumberAndPostalCode = JSON.parse(JSON.stringify(place.formatted_address));
      this.company.addresses[1].postalCode = JSON.parse(JSON.stringify(this.company.addresses[0].postalCode));
      this.company.addresses[1].countryCode = JSON.parse(JSON.stringify(this.company.addresses[0].countryCode));
      this.cd.detectChanges();
    }

  }
  public onChangedAssociatedCompanies(data) {
    this.company.associatedCompanies = data.map(item => {
      return { id: item };
    })
  }
  public onChangePhoneNumber() {
    if (this.company.addresses[1].sameAsBilling) {
      this.company.addresses[1].phoneNumbers[0].number = JSON.parse(JSON.stringify(this.company.addresses[0].phoneNumbers[0].number));
      this.onChangeShippingPhoneNumber();
    }
    this.validate.checkValidPhoneNumber(this.company.addresses[0].phoneNumbers[0].number);
  }
  public onChangeShippingPhoneNumber() {
    this.validate.checkValidShippingPhoneNumber(this.company.addresses[1].phoneNumbers[0].number);
  }
  public onChangeFirstName() {
    this.validate.checkValidFirstname(this.company.contacts[0].firstName);
  }
  onSelectJobTitle(data) {
    this.company.contacts[0].customerCompaniesInfo[0].setJobTitleDto(data);
  }
  public onChangePrimaryEmail() {
    this.validate.checkValidPrimaryEmail(this.company.contacts[0].primaryEmail);
  }
  public onSelectPaymentTerms(item) {
    this.company.paymentTerms = item.value;
  }
  public onChangeSubscribe(data) {
    this.company.contacts[0].customerCompaniesInfo[0].changeDefaultSubscriptions(data);
  }
  public onChangeTimeZone(data) {
    this.company.addresses[0].locale = (data) ? data.second : '';
    this.selectedTimeZone = data;
  }
  public onSelectPaymentMethod(item) {
    this.company.defaultPaymentMethod = item.value;
  }
  public onSelectServiceTypes(item) {
    this.company.serviceType = (item) ? item.name : null;
  }
  public onSelectTechLead(event) {
    this.company.techLeadId = (event) ? event.id : null;
  }
  public onChangeTags(tags) {
    this.company.setTags(tags);
  }
  public onChangeDescription(event) {
    this.company.description = event.target.value;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
