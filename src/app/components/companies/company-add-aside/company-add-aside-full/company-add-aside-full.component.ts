import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemFilterPerson } from 'src/app/components/left-panel/left-panel-companies/class/item-filter-person';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { ImageCroper } from 'src/app/services/modal/modal-image-cropper/class/image-croper';
import { ModalImageCropperStateService } from 'src/app/services/modal/modal-image-cropper/services/modal-image-cropper-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ImageCropperStateService } from 'src/app/states/image-cropper/image-cropper-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CompanyProfile } from '../../class/company-profile';
import { CompanySetting } from '../../class/company-setting';
import { CompanyValdiate } from '../../class/company-validate';
import { } from 'google-maps';
import { CompanyIndustry } from 'src/app/interfaces/company/company-industry';
import { CrmCompanyIndustry } from 'src/app/components/setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CrmCompanyServiceType } from 'src/app/components/setting/crm-settings/crm-company-service-type/class/crm-company-service-type';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { CrmCompanyJobTitle } from 'src/app/components/setting/crm-settings/crm-company-job-title/class/crm-company-job-title';

@Component({
  selector: 'company-add-aside-full',
  templateUrl: './company-add-aside-full.component.html',
  styleUrls: ['./company-add-aside-full.component.scss']
})
export class CompanyAddAsideFullComponent implements OnInit {
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  companyTypes = [new CompanySetting('Client', 'CLIENT'), new CompanySetting('Lead', 'LEAD'), new CompanySetting('Vendor', 'VENDOR'), new CompanySetting('Supplier', 'SUPPLIER')];
  paymentTerms = [new CompanySetting('COD', 0), new CompanySetting('7 days', 7), new CompanySetting('15 days', 15), new CompanySetting('30 days', 30)];
  paymentMethods = [new CompanySetting('Cash', 'CASH'),
  new CompanySetting('Cheque', 'CHEQUE'),
  new CompanySetting('Debit Card', 'DEBIT_CARD'),
  new CompanySetting('Credit Card', 'CREDIT_CARD'),
  new CompanySetting('Wire Transfer', 'WIRE_TRANSFER')];
  serviceTypes: Array<CrmCompanyServiceType> = [];
  @ViewChild('addresstext') addresstext: any;
  industries: Array<CrmCompanyIndustry> = [];
  locationIsinit: boolean = false;
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  listPersons: Array<ItemFilterPerson> = [];
  idUploadFile: string;
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
    private modalImageCropperStateService: ModalImageCropperStateService) { }

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
      this.getTehusers(this.usersStateService.getAllUsers());
    }
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getTehusers(data);
    })
    this.sub.add(getOnUsers);
    this.onCroppImage();
  }
  public onCroppImage() {
    let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {

      console.log("data", data);
      if (data && this.company.logo) this.companiesService.removeAttachment(this.company.logo.origin.id).subscribe(res => {

      });
      if (data) this.company.setLogo(data);
      if (!data) this.companiesService.removeAttachment(this.idUploadFile).subscribe(res => {

      });
    })
    this.sub.add(getConfirm);
  }
  private getTehusers(list) {
    list.forEach((item) => {
      if (item.accountType === "TECH" && !item.deletedAt) {
        this.listPersons.push(new ItemFilterPerson(item.id, `${item.firstName} ${item.lastName}`));
        this.listPersons.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
          1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      }
    })
  }
  removeLogo() {
    this.companiesService.removeAttachment(this.company.logo.origin.id).subscribe(data => {
      this.company.editLogo(null);
    })
  }
  public uploadFileOnBrower(event) {
    if (event.target.value) {
      const file = event.target.files[0];
      this.uploadFile(file).then((data: any) => {
        let res = JSON.parse(data.response);
        this.idUploadFile = res.id;
        this.modalImageCropperStateService.onInitOpen(new ImageCroper(res.base64, res.id));
        event.target.value = null;
        this.cd.detectChanges();
      });
    }
  }
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      var fd = new FormData();
      fd.append("file", file);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", (event) => {
        resolve(xhr);
      }, false);
      xhr.addEventListener("error", (error) => {
        reject(error);
      }, false);
      xhr.open("POST", "/file?isAvatar=true&ratio=1");
      xhr.send(fd);
    });
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
  public onCheckGoogleAutoComplete() {
    if (!this.locationIsinit) this.getPlaceAutocomplete();
  }
  private getPlaceAutocomplete() {
    this.locationIsinit = true;
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      {
        componentRestrictions: null,
        types: ['address']  // 'establishment' / 'address' / 'geocode'
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();

      this.invokeEvent(place);
    });
  }
  invokeEvent(place: any) {
    this.company.addresses[0].locationLat = place.geometry.location.lat();
    this.company.addresses[0].locationLng = place.geometry.location.lng();
    this.company.addresses[0].address = this.addresstext.nativeElement.value;
    this.company.addresses[0].addressWithSuitNumberAndPostalCode = place.formatted_address;
    place.address_components.forEach(item => {
      if (item.types.indexOf('postal_code') !== -1) {
        this.company.addresses[0].postalCode = item.short_name;
      }
      if (item.types.indexOf('country') !== -1) {
        this.company.addresses[0].countryCode = item.short_name;
      }
      this.cd.detectChanges();
    })
  }
  public onChangedAssociatedCompanies(data) {
    this.company.associatedCompanies = data.map(item => {
      return { id: item };
    })
  }
  public onChangePhoneNumber() {
    this.validate.checkValidPhoneNumber(this.company.addresses[0].phoneNumbers[0].number);
  }
  public onChangeFirstName() {
    this.validate.checkValidFirstname(this.company.contacts[0].firstName);
  }
  onSelectJobTitle(data) {
    this.company.contacts[0].jobTitleId = (data) ? data.id : null;
  }
  public onChangePrimaryEmail() {
    this.validate.checkValidPrimaryEmail(this.company.contacts[0].primaryEmail);
  }
  public onSelectPaymentTerms(item) {
    this.company.paymentTerms = item.value;
  }
  public onChangeSubscribe(data) {
    data.forEach(item => this.company.contacts[0].defaultSubscriptions[item.field] = item.selected);
  }
  public onChangeTimeZone(data) {
    this.company.addresses[0].locale = (data) ? data.second : '';
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
}
