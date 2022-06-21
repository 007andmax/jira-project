import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceTicketsService } from '../accounting-settings.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

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
  includeInvoiceAsAttachmentSetting: boolean = false;
  @Input() taxIdDescInput: any;
  @Input() taxIdInput: any;
  @Input() termInput: any;
  @Input() conditionInput: any;
  constructor(
    private formBuilder: FormBuilder,
    private invoiceTicketsService: InvoiceTicketsService,
    private toaster: ToastrService
  ) { }

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
      enableOwnerSending: [false],
      enableContactSending: [false],
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
          Validators.maxLength(30),
          Validators.pattern(/^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,30}$/)
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
          Validators.required
        ])
      ],
      primaryPhoneType: [''],
      secondaryPhone: [''],
      secondaryPhoneType: ['']
    });
    this.loading = true; $(".loading").css("display", "block");
    const source = [this.invoiceTicketsService.getInvoiceContact().pipe(catchError(error => of(undefined))),
    this.invoiceTicketsService.termsAndConditions().pipe(catchError(error => of(undefined))),
    this.invoiceTicketsService.actualNumber('INVOICE').pipe(catchError(error => of(undefined))),
    this.invoiceTicketsService.getTaxNumber().pipe(catchError(error => of(undefined)))];
    forkJoin(source)
      .subscribe(
        (data) => {
          if (data[0]) this.getInvoiceContact(data[0]);
          if (data[1]) this.getTermsAndConditions(data[1]);
          if (data[2]) this.getActualNumber(data[2]);
          if (data[3]) this.getTaxNumber(data[3]);
          this.loading = false; $(".loading").css("display", "none");
        },
        error => {
        }
      );
    /*  this.getInvoiceContact();
      this.getTermsAndConditions();
      this.getActualNumber();
      this.getTaxNumber();*/


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
    this.loading = true; $(".loading").css("display", "block");
    this.invoiceTicketsService.termsAndConditions().subscribe(
      (res: any) => {
        this.invoiceForm.patchValue({
          conditions: res.conditions
        });
      }
    );
  }

  getTaxNumber(res) {
    if (res) {
      this.invoiceForm.patchValue({
        taxId: res.taxId,
        taxIdDescription: res.taxIdDescription
      });
    }
  }

  /**
   * get invoice contact details
   */
  getInvoiceContact(res: any) {
    // this.getTaxNumber();
    // this.getConditions();
    if (res) {
      this.includeInvoiceAsAttachmentSetting = res.includeInvoiceAsAttachmentSetting;
      this.isDisable = res.invoiceContact.enabled;
      const state = !this.isDisable ? 'disable' : 'enable';
      if (!this.isDisable) {
        Object.keys(this.invoiceForm.controls).forEach(controlName => {
          if (
            controlName !== 'invoiceCount' &&
            controlName !== 'invoiceTerms' &&
            controlName !== 'enableInvoiceContact' &&
            controlName !== 'taxIdDescription' &&
            controlName !== 'taxId' &&
            controlName !== 'conditions'
          ) {
            this.invoiceForm.controls[controlName][state](); // disables/enables each form control based on 'this.formDisabled'
          }
        });
      }

      this.invoiceForm.patchValue({
        designation: res.invoiceContact.designation,
        email: res.invoiceContact.email,
        enableInvoiceContact: res.invoiceContact.enabled,
        enableOwnerSending: res.enableOwnerSending,
        firstName: res.invoiceContact.firstName,
        lastName: res.invoiceContact.lastName,
        enableContactSending: (!res.invoiceContact.enabled) ? true : res.invoiceContact.enableContactSending,
      });
      (<any>document.body.querySelector("#accounting-active")).checked = (!res.invoiceContact.enabled) ? true : res.invoiceContact.enableContactSending;
      const phoneNumbers = res.invoiceContact.phoneNumbers || [];
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
        if (phoneNumbers.length === 0) {
          this.invoiceForm.patchValue({
            primaryPhone: "",
            primaryPhoneType: "OFFICE"
          });
        }
      }
    }

  }

  /**
   * get invoice terms
   */

  getTermsAndConditions(res) {
    if (res) {
      this.invoiceForm.patchValue({
        invoiceTerms: res.term,
        conditions: res.conditions
      });
    }
  }

  /**
   * get invoice number
   */
  getActualNumber(res) {
    if (res) {
      this.invoiceForm.patchValue({
        invoiceCount: res.number
      });
    }
  }

  onEnableInvoice(data) {
    this.invoiceForm.patchValue({
      enableInvoiceContact: data
    });
    this.isDisable = data;
    const enable = data;
    const state = !enable ? 'disable' : 'enable';
    Object.keys(this.invoiceForm.controls).forEach(controlName => {
      if (
        controlName !== 'invoiceCount' &&
        controlName !== 'invoiceTerms' &&
        controlName !== 'enableInvoiceContact' &&
        controlName !== 'taxIdDescription' &&
        controlName !== 'taxId' &&
        controlName !== 'conditions'
      ) {
        this.invoiceForm.controls[controlName][state](); // disables/enables each form control based on 'this.formDisabled'
      }
    });
  }
  onEnableOwnerSending(data) {
    this.invoiceForm.patchValue({
      enableOwnerSending: data
    });
  }
  changeEnableContactSending(event) {
    this.invoiceForm.patchValue({
      enableContactSending: event.target.checked
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
        type: 'INVOICE',
        enableOwnerSending: this.invoiceForm.value.enableOwnerSending,
        includeInvoiceAsAttachmentSetting: this.includeInvoiceAsAttachmentSetting
      },
      invoiceContactDto: {
        enabled: this.invoiceForm.value.enableInvoiceContact,
        firstName: this.invoiceForm.value.firstName,
        lastName: this.invoiceForm.value.lastName,
        email: this.invoiceForm.value.email,
        designation: this.invoiceForm.value.designation,
        phoneNumbers: [],
        enableContactSending: this.invoiceForm.value.enableContactSending,
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

    this.loading = true; $(".loading").css("display", "block");
    this.invoiceTicketsService.updateInvoiceContact(objInvoice).subscribe(
      res => {
        this.loading = false; $(".loading").css("display", "none");
        this.toaster.success('Saved Successfully.');
      },
      error => {
        this.loading = false; $(".loading").css("display", "none");
        this.toaster.error('Bad Request');
      }
    );
  }
}
