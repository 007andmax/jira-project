import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceTicketsService } from '../invoice-tickets.service';

@Component({
  selector: 'app-invoice-settings',
  templateUrl: './invoice-settings.component.html',
  styleUrls: ['./invoice-settings.component.scss']
})
export class InvoiceSettingsComponent implements OnInit {
  invoiceForm: FormGroup;
  submitted = false;
  isAddPhone = false;

  constructor(
    private formBuilder: FormBuilder,
    private invoiceTicketsService: InvoiceTicketsService
  ) {}

  ngOnInit() {
    const emailPattern =
      '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';

    this.invoiceForm = this.formBuilder.group({
      invoiceCount: ['', Validators.required],
      invoiceTerms: ['', Validators.required],
      enabled: [''],
      firstName: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(15)]
      ],
      lastName: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(15)]
      ],
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

  getInvoiceContact() {
    this.invoiceTicketsService.getInvoiceContact().subscribe(
      (res: any) => {
        if (res) {
          this.invoiceForm.patchValue({
            designation: res.designation,
            email: res.email,
            enabled: res.enabled,
            firstName: res.firstName,
            lastName: res.lastName
          });

          if (res.phoneNumbers) {
            res.phoneNumbers.forEach((phone, i) => {
              if (i === 0) {
                this.invoiceForm.patchValue({
                  primaryPhone: phone.number,
                  primaryPhoneType: phone.typeNumber
                });
              }

              if (i === 1) {
                this.invoiceForm.patchValue({
                  secondaryPhone: phone.number,
                  secondaryPhoneType: phone.typeNumber
                });
              }
            });
          }
        }
      },
      error => {}
    );
  }

  getTermsAndConditions() {
    this.invoiceTicketsService.termsAndConditions().subscribe(
      (res: any) => {
        this.invoiceForm.patchValue({
          invoiceTerms: res.conditions
        });
      },
      error => {}
    );
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.invoiceForm.invalid) {
      return;
    }

    if (!this.invoiceForm.value.invoiceCount.trim()) {
      return;
    }

    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.invoiceForm.value));
  }
}
