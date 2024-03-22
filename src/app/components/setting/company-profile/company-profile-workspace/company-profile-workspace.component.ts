import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CompanyProfileService } from 'src/app/services/setting/company-profile.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-company-profile-workspace',
  templateUrl: './company-profile-workspace.component.html',
  styleUrls: ['./company-profile-workspace.component.scss']
})
export class CompanyProfileWorkspaceComponent implements OnInit {
  public loading = true;
  cProfileForm: FormGroup;
  cProfile = {
    address: [],
    logo: {},
    name: '',
    timeSettings: { workingDays: [], outliersSeconds: 0 },
    supportMailBox: ''
  };
  constructor(private companyProfileService: CompanyProfileService,
    private companiesStateService: CompaniesStateService,) { }

  ngOnInit() {
    this.createCProfileForm();
    this.getCompanyProfile(this.companiesStateService.getCompanyProfile());
  }
  createCProfileForm() {
    this.cProfileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      url: new FormControl(''),
      timeZone: new FormControl(''),
      primaryId: new FormControl(''),
      primaryPhone: new FormControl('', [Validators.minLength(14)]),
      primaryPhoneType: new FormControl(''),
      secondaryPhone: new FormControl(''),
      secondaryPhoneType: new FormControl(''),
      suiteNumber: new FormControl(''),
      address: new FormControl(''),
      postalCode: new FormControl(''),
      locale: new FormControl('', Validators.required),
      secondaryId: new FormControl(''),
    });
  }
  checkDomain() {
    this.checkValidateDomain();
    if (this.cProfileForm.get('url').getError('invalidate')) return;
    this.companyProfileService.checkDomain(this.cProfileForm.get(
      'url'
    ).value).subscribe(data => {
      this.cProfileForm.get(
        'url'
      ).setErrors({ 'incorrect': true });
    }, err => {
      this.cProfileForm.get(
        'url'
      ).setErrors({ 'incorrect': false });
      this.setDomain();
    })
  }
  checkValidateDomain() {
    var regex = /^[a-zA-Z\d\-]+$/;
    this.cProfileForm.get(
      'url'
    ).setValue(
      this.cProfileForm.get(
        'url'
      ).value.toLowerCase());
    if (!regex.test(this.cProfileForm.get(
      'url'
    ).value)) this.cProfileForm.get(
      'url'
    ).setErrors({ 'invalidate': true });
    if (regex.test(this.cProfileForm.get(
      'url'
    ).value)) this.cProfileForm.get(
      'url'
    ).setErrors({ 'invalidate': false });

  }
  setDomain() {
    this.companyProfileService.setDomain(this.cProfileForm.get(
      'url'
    ).value).subscribe(data => {

    })
  }
  /**
  * get company profile
  */
  getCompanyProfile(res) {
    this.loading = false;
    if (res) {
      this.cProfileForm.patchValue({
        url: res.techDomain,
      });
    }
  }
}
