
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';
import { CompanyProfileService } from 'src/app/services/setting/company-profile.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  standalone: true,
  imports: [MatErrorComponent, CommonModule, ReactiveFormsModule],
  selector: 'app-company-profile-workspace',
  templateUrl: './company-profile-workspace.component.html',
  styleUrls: ['./company-profile-workspace.component.scss']
})
export class CompanyProfileWorkspaceComponent implements OnInit {
  public loading = true;
  cProfileForm: UntypedFormGroup;
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
    this.cProfileForm = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
      url: new UntypedFormControl(''),
      timeZone: new UntypedFormControl(''),
      primaryId: new UntypedFormControl(''),
      primaryPhone: new UntypedFormControl('', [Validators.minLength(14)]),
      primaryPhoneType: new UntypedFormControl(''),
      secondaryPhone: new UntypedFormControl(''),
      secondaryPhoneType: new UntypedFormControl(''),
      suiteNumber: new UntypedFormControl(''),
      address: new UntypedFormControl(''),
      postalCode: new UntypedFormControl(''),
      locale: new UntypedFormControl('', Validators.required),
      secondaryId: new UntypedFormControl(''),
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
