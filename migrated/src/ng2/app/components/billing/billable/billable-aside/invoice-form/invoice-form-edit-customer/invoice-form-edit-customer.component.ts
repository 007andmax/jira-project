import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CompanyProfile } from 'src/ng2/app/components/companies/class/company-profile';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { CompanyValdiate } from 'src/ng2/app/components/companies/class/company-validate';
import { CompanyInvoiceValdiate } from './class/company-invoice-validate';
import { Subscription } from 'rxjs';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';

@Component({
  selector: 'app-invoice-form-edit-customer',
  templateUrl: './invoice-form-edit-customer.component.html',
  styleUrls: ['./invoice-form-edit-customer.component.scss']
})
export class InvoiceFormEditCustomerComponent implements OnInit, OnDestroy {
  company: CompanyProfile = new CompanyProfile();
  @Input() dropDown: NgbDropdown;
  @ViewChild('addresstext') addresstext: any;
  @Output() onUpdateCompany = new EventEmitter();
  locationIsinit: boolean = false;
  sub: Subscription = new Subscription();
  validate: CompanyInvoiceValdiate = new CompanyInvoiceValdiate();
  constructor(private companiesService: CompaniesService,
    private billableStateService: BillableStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    let getCompanyFromEdit = this.billableStateService.getOnEditCustomer().subscribe((data: CompanyProfile) => {
      this.company = new CompanyProfile();
      this.company.onEditMode(JSON.parse(JSON.stringify(data)));
      this.cd.detectChanges();
    })
    this.sub.add(getCompanyFromEdit);
  }
  public onCheckGoogleAutoComplete() {
    if (!this.locationIsinit) this.getPlaceAutocomplete();
  }
  public getCompany() {
    return this.company;
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
  public onChangeName() {
    if (this.company.name && this.company.name.length > 0) {
      let checkCompanyName = this.companiesService.checkCompanyName(this.company.id, this.company.name).subscribe((data: any) => {
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
  public onUpdate() {
    if (!this.validate.isValidate(this.company)) return;
    let updateCompany = this.companiesService.updateCompany(this.company).subscribe(data => {
      this.onUpdateCompany.emit(null);
      this.close();
      this.cd.detectChanges();
    })
    this.sub.add(updateCompany);
  }
  close() {
    this.locationIsinit = false;
    this.company = new CompanyProfile();
    this.validate = new CompanyInvoiceValdiate();
    this.dropDown.close();
  }
  public onChangeLastName() {
    this.validate.checkValidLastName(this.company.contacts[0].lastName);
  }
  public onChangeFirstName() {
    this.validate.checkValidFirstname(this.company.contacts[0].firstName);
  }
  public onChangePrimaryEmail() {
    this.validate.checkValidPrimaryEmail(this.company.contacts[0].primaryEmail);
  }
  public onChangePhoneNumber() {
    this.validate.checkValidPhoneNumber(this.company.contacts[0].phoneNumbers[0].number);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
