import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CompanyProfile } from '../class/company-profile';
import { CompanySetting } from '../class/company-setting';
import { CompanySubscription } from '../class/company-subscription';
import { CompanyValdiate } from '../class/company-validate';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperStateService } from 'src/app/states/image-cropper/image-cropper-state.service';
import { CompanySubscriptionStateService } from '../company-subscription/class/company-subscription-state.service';
import { CompanyTimeZoneStateService } from '../company-time-zone/services/company-time-zone-state.service';
import { CompanyTagsStateService } from '../company-tags/states/company-tags-state.service';
import { ItemFilterPerson } from '../../left-panel/left-panel-companies/class/item-filter-person';
import { Subscription } from 'rxjs';
import { CROPP_AVATAR_COMPANY, EDIT_AVATAR_COMPANY } from 'src/app/const/image-cropp';
import { ModalImageCropperStateService } from 'src/app/services/modal/modal-image-cropper/services/modal-image-cropper-state.service';
import { ImageCroper } from 'src/app/services/modal/modal-image-cropper/class/image-croper';
import { CompanyEditLogo } from '../class/company-edit-logo';
import { UsersService } from 'src/app/services/users/users.service';
import { CompanyTagsComponent } from '../company-tags/company-tags.component';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { CompanyAssociateComponent } from '../../company-dashboard/company-dash-associate/company-associate/company-associate.component';
import { AppService } from 'src/app/states/app/app.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CrmCompanyIndustry } from '../../setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { CrmCompanyServiceType } from '../../setting/crm-settings/crm-company-service-type/class/crm-company-service-type';
import { CrmCompanyJobTitle } from '../../setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { MODE_EDIT_SUBSCRIPTION, MODE_EDIT_USER_SUBSCRIPTION } from 'src/app/const/users';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { TimeZone } from '../company-time-zone/class/time-zone';
import { ThirdPartyApp } from '../class/company-third-party-apps';

@Component({
  selector: 'app-company-edit-aside',
  templateUrl: './company-edit-aside.component.html',
  styleUrls: ['./company-edit-aside.component.scss']
})
export class CompanyEditAsideComponent implements OnInit, OnDestroy {
  opened = false;
  company: CompanyProfile = new CompanyProfile();
  industries: Array<CrmCompanyIndustry> = [];
  selectedTechLead: ItemFilterPerson;
  companyTypes = [new CompanySetting('Client', 'CLIENT'), new CompanySetting('Lead', 'LEAD'), new CompanySetting('Vendor', 'VENDOR'), new CompanySetting('Supplier', 'SUPPLIER')];
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  paymentTerms = [new CompanySetting('COD', 0), new CompanySetting('7 days', 7), new CompanySetting('15 days', 15), new CompanySetting('30 days', 30), new CompanySetting('45 days', 45), new CompanySetting('60 days', 60)];
  serviceTypes: Array<CrmCompanyServiceType> = [];
  paymentMethods = [new CompanySetting('Cash', 'CASH'),
  new CompanySetting('Cheque', 'CHEQUE'),
  new CompanySetting('Debit Card', 'DEBIT_CARD'),
  new CompanySetting('Credit Card', 'CREDIT_CARD'),
  new CompanySetting('Wire Transfer', 'WIRE_TRANSFER')];
  listPersons: Array<ItemFilterPerson> = [];
  subscriptions: Array<CompanySubscription> = [new CompanySubscription('Ticket Updates', 'ticket'),
  new CompanySubscription('Ticket Manager', 'ticketManager'),
  new CompanySubscription('Invoice Updates', 'invoice')];
  showSelect = false;
  validate: CompanyValdiate = new CompanyValdiate();
  sub: Subscription = new Subscription();
  locationIsinit: boolean = false;
  selectedJobTitle: CrmCompanyJobTitle;
  idUploadFile: string;
  MODE_EDIT_USER_SUBSCRIPTION = MODE_EDIT_USER_SUBSCRIPTION;
  MODE_EDIT_SUBSCRIPTION = MODE_EDIT_SUBSCRIPTION;
  selectedTimeZone: TimeZone;
  @ViewChild('companyTags', { static: true }) companyTags: CompanyTagsComponent;
  @ViewChild('addresstext', { static: true }) addresstext: any;
  @ViewChild('clientType', { static: true }) clientType: DropDownComponent;
  @ViewChild('jobTitleDp', { static: true }) jobTitleDp: DropDownComponent;
  @ViewChild('paymentTerm', { static: true }) paymentTerm: DropDownComponent;
  @ViewChild('paymentMethod', { static: true }) paymentMethod: DropDownComponent;
  @ViewChild('serviceType', { static: true }) serviceType: DropDownComponent;
  @ViewChild('companyAssociate', { static: false }) companyAssociate: CompanyAssociateComponent;
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  constructor(public companiesStateService: CompaniesStateService,
    private companiesService: CompaniesService,
    private usersStateService: UsersStateService,
    private imageCropperStateService: ImageCropperStateService,
    private elRef: ElementRef,
    private usersService: UsersService,
    private companyTimeZoneState: CompanyTimeZoneStateService,
    private modalImageCropperStateService: ModalImageCropperStateService,
    public appService: AppService,
    private crmStateService: CrmStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.company.fullVersion();
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

    let onGetServiceType = this.crmStateService.onGetServiceType.subscribe(data => {
      this.serviceTypes = data;
      if (this.serviceType) this.serviceType.reset(this.serviceTypes);
      this.setSelectServiceTypes();
    })
    this.sub.add(onGetServiceType);
    let onTimeZone = this.companyTimeZoneState.onTimeZone.subscribe(data => {
      this.setTimeZone(data);
    })
    this.sub.add(onTimeZone);
    if (this.usersStateService.getAllUsers().length > 0) {
      this.getTechusers(this.usersStateService.getAllUsers());
    }
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getTechusers(data);
    })
    this.sub.add(getOnUsers);
    this.onCroppImage();
    this.onEditCompany();
  }
  setTimeZone(data) {
    let list = data.map(item => new TimeZone(item));
    if (this.company.addresses.length > 0 && this.company.addresses[0].timeZone) {
      this.selectedTimeZone = list.find(item => item.second === this.company.addresses[0].timeZone.name);
    } else {
      this.selectedTimeZone = null;
    }
  }
  removeLogo() {
    this.companiesService.removeAvatar(this.company.id).subscribe(data => {
      this.company.editLogo(null);
    })
  }
  getSelectedPaymentMethod() {
    let index = this.paymentMethods.findIndex(item => item.value === this.company.defaultPaymentMethod);
    if (index > -1) return this.paymentMethods[index];
    return null;
  }
  onSelectJobTitle(data) {
    this.company.contacts[0].customerCompaniesInfo[0].setJobTitleDto(data);
    this.selectedJobTitle = data;
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
  onChangeBillingLocationName(data) {
    if (this.company.addresses[1].sameAsBilling) {
      this.company.addresses[1].locationName = JSON.parse(JSON.stringify(this.company.addresses[0].locationName));
      this.validate.resetShippingAddress()
    }
    this.validate.resetBillindAddress();
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
  onChangeBillingSuiteNo(data) {
    if (this.company.addresses[1].sameAsBilling) this.company.addresses[1].suiteNumber = JSON.parse(JSON.stringify(this.company.addresses[0].suiteNumber));
  }
  onChangeBillingZip(data) {
    if (this.company.addresses[1].sameAsBilling) this.company.addresses[1].postalCode = JSON.parse(JSON.stringify(this.company.addresses[0].postalCode));

  }
  public onChangeShippingPhoneNumber() {
    this.validate.checkValidShippingPhoneNumber(this.company.addresses[1].phoneNumbers[0].number);
  }
  public onCheckGoogleAutoComplete(event, index) {
    if (event.target.getAttribute("location-is-init") == "false") this.getPlaceAutocomplete(event, index);
  }
  onCheckShippingAddress() {
    if (this.company.addresses[1].address.length == 0) this.company.addresses[1].addressWithSuitNumberAndPostalCode = "";
  }
  close() {
    this.opened = false;
    this.locationIsinit = false;

    this.company = new CompanyProfile();
    this.company.initShippingAdress();
    this.companyTypes.forEach(item => item.selected = false);
    this.paymentTerms.forEach(item => item.selected = false);
    this.subscriptions.forEach(item => item.selected = false);
    this.selectedTechLead = null;
    this.selectedJobTitle = null;
    this.validate = new CompanyValdiate();
    this.clientType.clearWithOutChanges();
    this.jobTitleDp.clearWithOutChanges();
    this.paymentTerm.clearWithOutChanges();
    this.paymentMethod.clearWithOutChanges();
    this.serviceType.clearWithOutChanges();

  }
  onEditCompany() {
    let getCompanyFromEdit = this.companiesStateService.getCompanyFromEdit().subscribe((data: CompanyProfile) => {
      this.company = new CompanyProfile();
      this.company.onEditMode(data);
      if (this.company.addresses.length == 1) this.company.initShippingAdress();
      //this.companyTimeZoneState.onEditMode(this.company.addresses[0].timeZone);
      if (this.companyTimeZoneState.getTimeZone().length > 0) this.setTimeZone(this.companyTimeZoneState.getTimeZone());
      let indexTerms = this.paymentTerms.findIndex(item => item.value === this.company.paymentTerms);
      if (indexTerms > -1) this.onSelectPaymentTerms(this.paymentTerms[indexTerms]);
      let indexPersone = this.listPersons.findIndex(item => item.id === this.company.techLeadId);
      if (indexPersone > -1) this.selectedTechLead = this.listPersons[indexPersone];
      let indexType = this.companyTypes.findIndex(item => item.value === this.company.clientType);
      if (indexType > -1) this.onSelectCompanyTypes(this.companyTypes[indexType]);
      if (this.company.contacts[0].customerCompaniesInfo[0].jobTitleDto) this.selectedJobTitle = this.jobTitleList.find(item => item.id === this.company.contacts[0].customerCompaniesInfo[0].jobTitleDto.id);
      this.companyTags.setSelectedTag(this.company.tags);
      this.elRef.nativeElement.querySelector("#company-description").value = this.company.description;
      this.opened = true;
      if (this.crmStateService.getServiceTypeList().length === 0) {
        this.crmStateService.onInitGetServiceTypeList();
      } else {
        this.serviceTypes = this.crmStateService.getServiceTypeList();
        this.setSelectServiceTypes();
      }
      console.log("this.selectedJobTitle", this.selectedJobTitle);
      this.cd.detectChanges();
    })
    this.sub.add(getCompanyFromEdit);
  }
  removeThirdParty(i) {
    this.company.thirdPartyApps.splice(i, 1);
  }
  setSelectServiceTypes() {
    let indexServiceType = this.serviceTypes.findIndex(item => item.name === this.company.serviceType);
    if (indexServiceType > -1) this.onSelectServiceTypes(this.serviceTypes[indexServiceType]);
  }
  onSameAsBilling(event) {
    if (event.target.checked) {
      this.company.addresses[1].initSameAsBilling(this.company.addresses[0]);
      this.validate.resetShippingAddress();
      this.onChangeShippingPhoneNumber();
    }
  }
  public onSelectCompanyTypes(type) {
    if (type) this.company.clientType = type.value;
    this.validate.resetType();
    this.onChangeType();
  }
  public onChangeType() {
    this.validate.checkValidType(this.company.clientType);
  }
  public onChangedAssociatedCompanies(data) {
    this.company.associatedCompanies = data.map(item => {
      return { id: item };
    })
  }

  public onSelectTechLead(event) {
    if (event) {
      this.company.techLeadId = event.id;
      this.selectedTechLead = event;
    } else {
      this.company.techLeadId = null;
      this.selectedTechLead = null;
    }
  }
  public onSelectPaymentMethod(item) {
    this.company.defaultPaymentMethod = item.value;
  }
  public onSelectPaymentTerms(item) {
    this.company.paymentTerms = item.value;
  }
  public onSelectServiceTypes(item) {
    this.company.serviceType = (item) ? item.name : null;
  }
  public getDefaultSubscriptions() {
    let customerCompaniesInfo = this.company.contacts[0].customerCompaniesInfo.find(item => item.companyId == this.company.id);
    return customerCompaniesInfo.defaultSubscriptions;
  }
  onCheckEmail() {
    if (this.company.contacts[0].primaryEmail && this.company.contacts[0].primaryEmail.length > 0) this.onCheckValidPrimaryEmail();
  }
  onCheckValidPrimaryEmail() {
    this.usersService.checkValidPrimaryEmail(this.company.contacts[0].primaryEmail, this.companiesStateService.getCurrentCompany().id, this.company.contacts[0].id).subscribe((data: any) => {
      this.validate.setExistPrimaryContactEmail(data.value);
      this.cd.detectChanges();
    })
  }
  public onChangePrimaryEmail() {
    this.validate.checkValidPrimaryEmail(this.company.contacts[0].primaryEmail);
  }
  public onChangeSubscribe(data) {
    let index = this.company.contacts[0].customerCompaniesInfo.findIndex(item => item.companyId == this.company.id);
    this.company.contacts[0].customerCompaniesInfo[index].changeDefaultSubscriptions(data);
  }
  public onChangeDomain() {
    this.validate.resetDomainIsExist();
    this.validate.checkValidDomain(this.company.domain);
    if (this.validate.getDomain() && this.validate.getDomainValid()) {
      this.companiesService.checkCompanyDomain(this.company.id, this.company.domain).subscribe((data: any) => {
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
  addThirdParty() {
    this.company.thirdPartyApps.push(new ThirdPartyApp({
      appId: '',
      appName: ''
    }));
  }
  public onChangeName() {
    if (this.company.name && this.company.name.length > 0) {
      let checkCompanyName = this.companiesService.checkCompanyName(this.company.id, this.company.name).subscribe((data: any) => {
        if (data.value) {
          this.validate.resetName();
          this.validate.resetNameIsExist();
          this.company.addresses[0].locationName = JSON.parse(JSON.stringify(this.company.name));
          if (this.company.addresses[1].sameAsBilling) {
            this.company.addresses[1].locationName = JSON.parse(JSON.stringify(this.company.name));
            this.validate.resetShippingAddress();
          }
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
  public onChangePhoneNumber() {
    if (this.company.addresses[1].sameAsBilling) {
      this.company.addresses[1].phoneNumbers[0].number = JSON.parse(JSON.stringify(this.company.addresses[0].phoneNumbers[0].number));
      this.onChangeShippingPhoneNumber();
    }
    this.validate.checkValidPhoneNumber(this.company.addresses[0].phoneNumbers[0].number);
  }
  public onChangeFirstName() {
    this.validate.checkValidFirstname(this.company.contacts[0].firstName);
  }

  public onChangeTimeZone(data) {
    this.company.addresses[0].locale = (data) ? data.second : '';
    this.selectedTimeZone = data;
  }
  onSelectClientIndustry(item) {
    this.company.clientIndustry.name = (item) ? item.name : null;
  }
  getAssociatedCompaniesIds() {
    return this.company.associatedCompanies.map(item => item.id);
  }
  public onChangeTags(tags) {
    this.company.setTags(tags);
  }
  public onChangeDescription(event) {
    this.company.description = event.target.value;
  }
  public onUpdateFull() {
    if (!this.validate.isValidate(this.company)) return;
    this.addBtn.setDisabled(true);
    let updateCompany = this.companiesService.updateCompany(this.company.getDataForUpdate()).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.close();
      this.cd.detectChanges();
    }, err => {
      this.addBtn.setDisabled(false);
    })
    this.sub.add(updateCompany);
  }
  public onCroppImage() {
    let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {
      if (this.imageCropperStateService.getAction() === EDIT_AVATAR_COMPANY) {
        if (this.opened && data) this.editCompanyAvatar(data);
        return;
      }
      if (this.opened && !data) {
        this.companiesService.removeAttachment(this.idUploadFile).subscribe(res => {

        });
      }
      if (!this.opened || !data) return;
      if (this.company.logo) this.companiesService.removeAvatar(this.company.id).subscribe(res => {
        this.editCompanyAvatar(data);
      })
      if (!this.company.logo) this.editCompanyAvatar(data);

    })
    this.sub.add(getConfirm);
  }
  editCompanyAvatar(data) {
    this.companiesService.editCompanyAvatar(this.company.id, new CompanyEditLogo(data.croppedImage.base64, data.croppedImage.height,
      this.company.id, (data.edit) ? this.company.logo.origin.id : data.id, data.croppedImage.width, data.croppedImage.imagePosition.x1, data.croppedImage.imagePosition.y1)).subscribe(res => {
        this.company.editLogo(res);
      })
  }
  public onChangeAvatar() {
    this.downloadCompanyLogo().then(data => {
      this.imageCropperStateService.setAction(EDIT_AVATAR_COMPANY);
      this.modalImageCropperStateService.onInitOpen(new ImageCroper(data, this.company.logo.origin.id, true));
      this.cd.detectChanges();
    })
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
  getSelectedClientTypes() {
    let index = this.industries.findIndex(item => item.name === (this.company.clientIndustry && this.company.clientIndustry.name) ? this.company.clientIndustry.name : null);
    if (index > -1) return this.industries[index];
    return null;
  }
  getSelectedCompanyTypes() {
    let index = this.companyTypes.findIndex(item => item.value === this.company.clientType);
    if (index > -1) return this.companyTypes[index];
    return null;
  }
  getSelectedServiceType() {
    let index = this.serviceTypes.findIndex(item => item.name === this.company.serviceType);
    if (index > -1) return this.serviceTypes[index];
    return "";
  }
  getSelectedPaymentTerms() {
    let index = this.paymentTerms.findIndex(item => item.value === this.company.paymentTerms);
    if (index > -1) return this.paymentTerms[index];
    return null;
  }
  getSelectedDropDown(value) {
    if (!value) return "";
    let editValue = value.substring(1, value.length);
    editValue = editValue.toLowerCase();
    editValue = `${value[0]}${editValue}`;
    return editValue;
  }
  downloadCompanyLogo() {
    return new Promise((resolve, reject) => {
      if (this.company.logo && this.company.logo && this.company.logo.base64 && !this.company.logo.cropped) {
        resolve(this.company.logo.base64);
      } else {
        var req = new XMLHttpRequest();
        req.responseType = "arraybuffer";
        req.open('GET', `/file/${this.company.logo.origin.id}.jpg`, true); /* Третий аргумент true означает асинхронность */
        req.onload = (oEvent) => {
          var blob = new Blob([req.response], { type: "image/jpg" });
          this.changeFile(blob).then((base64: string): any => {
            resolve(base64);
          });
        };
        req.send(null);
      }
    });
  };
  public uploadFileOnBrower(event) {
    this.imageCropperStateService.setAction(CROPP_AVATAR_COMPANY);
    this.imageCropperStateService.uploadFileOnBrower(event).then((data: any) => {
      this.idUploadFile = data.id;
    })
  }
  changeFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  /**
  * show selecct wrapper
  */
  public showSelectWrapper($event) {
    this.showSelect = !this.showSelect;
    this.stopEvent($event);
  }

  /**
  * stop event
  */
  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
