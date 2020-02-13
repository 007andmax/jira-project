import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceTicketsService } from '../invoice-tickets.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoice-settings',
  templateUrl: './invoice-settings.component.html',
  styleUrls: ['./invoice-settings.component.scss']
})
export class InvoiceSettingsComponent implements OnInit {
  invoiceForm: FormGroup;
  submitted = false;
  isAddPhone = false;
  loading = false;
  isDisable: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private invoiceTicketsService: InvoiceTicketsService,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    const emailPattern =
      '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';

    this.invoiceForm = this.formBuilder.group({
      invoiceCount: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?([0-9]\d*)?$/)
        ])
      ],
      invoiceTerms: ['', Validators.required],
      enableInvoiceContact: [false],
      firstName: [
        { value: '', disabled: this.isDisable },
        [Validators.required, Validators.minLength(2), Validators.maxLength(15)]
      ],
      lastName: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(15)]
      ],
      taxId: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,15}$/)
        ]
      ],
      taxIdDescription: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,15}$/)
        ]
      ],
      conditions: [''],
      designation: ['', [Validators.minLength(2), Validators.maxLength(15)]],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(emailPattern)
        ])
      ],
      primaryPhone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\+?[0-9\s\-\+\(\)\.\,]{1,20}$/)
        ])
      ],
      primaryPhoneType: [''],
      secondaryPhone: [''],
      secondaryPhoneType: ['']
    });

    this.getInvoiceContact();
    this.getTermsAndConditions();
    this.getActualNumber();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.invoiceForm.controls;
  }

  /**
   * display secondary phone, when clicked
   */
  onAddPhone() {
    this.isAddPhone = !this.isAddPhone;
    if (this.isAddPhone) {
      this.invoiceForm.patchValue({
        secondaryPhoneType: 'OFFICE'
      });
    } else {
      this.invoiceForm.patchValue({
        secondaryPhone: '',
        secondaryPhoneType: '',
        secondaryId: ''
      });
    }
  }

  getConditions() {
    this.loading = true;
    this.invoiceTicketsService.termsAndConditions().subscribe(
      (res: any) => {
        this.invoiceForm.patchValue({
          conditions: res.conditions
        });
      }
    );
  }

  getTaxNumber() {
    this.loading = true;
    this.invoiceTicketsService.getTaxNumber().subscribe(
      (res: any) => {
        if (res) {
          this.invoiceForm.patchValue({
            taxId: res.taxId,
            taxIdDescription: res.taxIdDescription
          });
        }
      },
      error => {}
    );
  }

  /**
   * get invoice contact details
   */
  getInvoiceContact() {
    this.getTaxNumber();
    this.getConditions();
    this.loading = true;
    this.invoiceTicketsService.getInvoiceContact().subscribe(
      (res: any) => {
        this.loading = false;
        if (res) {
          this.isDisable = res.enabled;
          const state = !this.isDisable ? 'disable' : 'enable';
          if (!this.isDisable) {
            Object.keys(this.invoiceForm.controls).forEach(controlName => {
              if (
                controlName !== 'invoiceCount' &&
                controlName !== 'invoiceTerms' &&
                controlName !== 'enableInvoiceContact'
              ) {
                this.invoiceForm.controls[controlName][state](); // disables/enables each form control based on 'this.formDisabled'
              }
            });
          }

          this.invoiceForm.patchValue({
            designation: res.designation,
            email: res.email,
            enableInvoiceContact: res.enabled,
            firstName: res.firstName,
            lastName: res.lastName
          });

          const phoneNumbers = res.phoneNumbers || [];
          if (phoneNumbers) {
            phoneNumbers.forEach((phone, i) => {
              if (i === 0) {
                this.invoiceForm.patchValue({
                  primaryPhone: phone.number,
                  primaryPhoneType: phone.typeNumber
                });
              }

              if (i === 1) {
                this.isAddPhone = true;
                this.invoiceForm.patchValue({
                  secondaryPhone: phone.number,
                  secondaryPhoneType: phone.typeNumber
                });
              }
            });
          }
        }
      },
      error => {
        this.loading = false;
      }
    );
  }

  /**
   * get invoice terms
   */

  getTermsAndConditions() {
    this.loading = true;
    this.invoiceTicketsService.termsAndConditions().subscribe(
      (res: any) => {
        this.loading = false;
        if (res) {
          this.invoiceForm.patchValue({
            invoiceTerms: res.term
          });
        }
      },
      error => {
        this.loading = false;
      }
    );
  }

  /**
   * get invoice number
   */
  getActualNumber() {
    this.loading = true;
    this.invoiceTicketsService.actualNumber('INVOICE').subscribe(
      (res: any) => {
        this.loading = false;
        if (res) {
          this.invoiceForm.patchValue({
            invoiceCount: res.number
          });
        }
      },
      error => {
        this.loading = false;
      }
    );
  }

  onEnableInvoice() {
    const enable = this.invoiceForm.value.enableInvoiceContact;
    this.isDisable = enable;
    const state = !enable ? 'disable' : 'enable';
    Object.keys(this.invoiceForm.controls).forEach(controlName => {
      if (
        controlName !== 'invoiceCount' &&
        controlName !== 'invoiceTerms' &&
        controlName !== 'enableInvoiceContact'
      ) {
        this.invoiceForm.controls[controlName][state](); // disables/enables each form control based on 'this.formDisabled'
      }
    });
  }

  /**
   *  saved records.
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.invoiceForm.invalid) {
      return;
    }

    if (!this.invoiceForm.value.invoiceCount.trim()) {
      return;
    }

    const objInvoice = {
      emailSettingPageNumberFormDto: {
        count: this.invoiceForm.value.invoiceCount,
        term: this.invoiceForm.value.invoiceTerms,
        termsAndConditions: this.invoiceForm.value.conditions,
        type: 'INVOICE'
      },
      enableInvoiceContact: this.invoiceForm.value.enableInvoiceContact,
      invoiceContactDto: {
        enabled: true,
        firstName: this.invoiceForm.value.firstName,
        lastName: this.invoiceForm.value.lastName,
        email: this.invoiceForm.value.email,
        designation: this.invoiceForm.value.designation,
        phoneNumbers: []
      },
      taxNumber: {
        taxIdDescription: this.invoiceForm.value.taxIdDescription,
        taxId: this.invoiceForm.value.taxId
      }
    };

    const phoneNumbers = [];

    if (this.invoiceForm.value.primaryPhone) {
      const phone = { number: '', typeNumber: '' };
      phone.number = this.invoiceForm.value.primaryPhone;
      phone.typeNumber = this.invoiceForm.value.primaryPhoneType;
      phoneNumbers.push(phone);
    }

    if (this.invoiceForm.value.secondaryPhone) {
      const phone = { number: '', typeNumber: '' };
      phone.number = this.invoiceForm.value.secondaryPhone;
      phone.typeNumber = this.invoiceForm.value.secondaryPhoneType;
      phoneNumbers.push(phone);
    }
    objInvoice.invoiceContactDto.phoneNumbers = phoneNumbers;

    this.loading = true;
    this.invoiceTicketsService.updateInvoiceContact(objInvoice).subscribe(
      res => {
        this.loading = false;
        this.toaster.success('Saved Successfully.');
      },
      error => {
        this.loading = false;
        this.toaster.error('Bad Request');
      }
    );
  }
}
