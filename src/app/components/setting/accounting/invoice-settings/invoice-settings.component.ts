import { Component, OnInit, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceTicketsService } from '../../../../services/accounting/accounting-settings.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';
import { AppStateService } from 'src/app/states/app/app-state.service';

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
  includeAccountReceivableReportAsAttachmentSetting: boolean = false;
  invoiceTerm: any;
  primaryPhoneType;
  secondaryPhoneType = new TitleListType("Office", "OFFICE");
  phoneTypes = [new TitleListType("Mobile", "MOBILE"),
  new TitleListType("Office", "OFFICE"),
  new TitleListType("Fax", "FAX")];
  invoiceTerms = [new TitleListType("15 days", "15"),
  new TitleListType("30 days", "30"),
  new TitleListType("45 days", "45"),
  new TitleListType("60 days", "60")];
  @Input() taxIdDescInput: any;
  @Input() taxIdInput: any;
  @Input() termInput: any;
  @Input() conditionInput: any;
  constructor(
    private formBuilder: FormBuilder,
    private invoiceTicketsService: InvoiceTicketsService,
    private toaster: ToastrService,
    private elRef: ElementRef,
    private appStateService: AppStateService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    const emailPattern =
      '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';

    this.invoiceForm = this.formBuilder.group({
      invoiceCount: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?([0-9]\d*)?$/),
          Validators.minLength(1), Validators.maxLength(7)
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
        [Validators.maxLength(15)]
      ],
      taxId: [
        '',
        [
          Validators.maxLength(30),
          Validators.pattern(/^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,30}$/)
        ]
      ],
      taxIdDescription: [
        '',
        [
          Validators.maxLength(30),
          Validators.pattern(/^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,30}$/)
        ]
      ],
      conditions: ['', [Validators.maxLength(400)]],
      designation: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
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
          Validators.minLength(14)
        ])
      ],
      primaryPhoneType: [''],
      secondaryPhone: [''],
      secondaryPhoneType: ['']
    });
    this.loading = true;
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
          this.loading = false;
        },
        error => {
        }
      );
    /*  this.getInvoiceContact();
      this.getTermsAndConditions();
      this.getActualNumber();
      this.getTaxNumber();*/


  }
  onChangePrimaryPhoneType(data) {
    this.primaryPhoneType = data;
    this.invoiceForm.patchValue({
      primaryPhoneType: data.type,
    });
  }
  public onPastMemo(value) {
    this.invoiceForm.patchValue({ conditions: value });
  }

  /**
  * Subscribe to change description
  * @param event - description event
  */
  public onChangeMemo(event) {
    this.invoiceForm.patchValue({ conditions: event.target.value });
  }

  onInvoiceTermsChange(data) {
    this.invoiceTerm = data;
    this.invoiceForm.patchValue({ invoiceTerms: data.type });
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
      this.includeAccountReceivableReportAsAttachmentSetting = res.includeAccountReceivableReportAsAttachmentSetting;
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
            this.primaryPhoneType = this.phoneTypes.find(item => item.type == phone.typeNumber.toUpperCase());

          }

          if (i === 1) {
            this.isAddPhone = true;
            this.invoiceForm.patchValue({
              secondaryPhone: phone.number,
              secondaryPhoneType: phone.typeNumber
            });
            this.secondaryPhoneType = this.phoneTypes.find(item => item.type == phone.typeNumber.toUpperCase());
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
      this.invoiceTerm = this.invoiceTerms.find(item => item.type == res.term);
      this.elRef.nativeElement.querySelector('#memo-invoice').value = res.conditions;
      //this.cd.detectChanges();
      this.appStateService.changeDetectorRef();
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
  onChangeSecondaryPhoneType(data) {
    this.secondaryPhoneType = data;
    this.invoiceForm.patchValue({
      secondaryPhoneType: data.type,
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
        includeInvoiceAsAttachmentSetting: this.includeInvoiceAsAttachmentSetting,
        includeAccountReceivableReportAsAttachmentSetting: this.includeAccountReceivableReportAsAttachmentSetting
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
    this.invoiceTicketsService.updateInvoiceContact(objInvoice).subscribe(
      res => {
        this.toaster.success('Saved Successfully.');
        this.appStateService.changeDetectorRef();
      },
      error => {
        this.toaster.error('Bad Request');
        this.appStateService.changeDetectorRef();
      }
    );
  }
}
