import { Component, OnInit, Input, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { InvoiceTicketsService } from '../../../../services/accounting/accounting-settings.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { InvoiceSettings } from './class/invoice-settings';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';

@Component({
  selector: 'app-invoice-settings',
  templateUrl: './invoice-settings.component.html',
  styleUrls: ['./invoice-settings.component.scss']
})
export class InvoiceSettingsComponent implements OnInit {
  invoiceForm: UntypedFormGroup;
  submitted = false;
  isAddPhone = false;
  loading = false;
  isDisable: boolean;
  invoiceTerm: any;
  paymentMethod: any;
  primaryPhoneType;
  secondaryPhoneType = new TitleListType("Mobile", "MOBILE");
  phoneTypes = [new TitleListType("Mobile", "MOBILE"),
  new TitleListType("Office", "OFFICE"),
  new TitleListType("Fax", "FAX")];
  invoiceTerms = [new TitleListType("COD", "0"),
  new TitleListType("7 days", "7"),
  new TitleListType("15 days", "15"),
  new TitleListType("30 days", "30"),
  new TitleListType("45 days", "45"),
  new TitleListType("60 days", "60")];
  paymentMethods = [new CompanySetting('Cash', 'CASH'),
  new CompanySetting('Cheque', 'CHEQUE'),
  new CompanySetting('Debit Card', 'DEBIT_CARD'),
  new CompanySetting('Credit Card', 'CREDIT_CARD'),
  new CompanySetting('Wire Transfer', 'WIRE_TRANSFER')];
  @Input() taxIdDescInput: any;
  @Input() taxIdInput: any;
  @Input() termInput: any;
  @Input() conditionInput: any;
  invoiceSettings: InvoiceSettings;
  @ViewChild('primaryPhoneTypeDd', { static: true }) primaryPhoneTypeDd: DropDownComponent;
  constructor(
    private formBuilder: UntypedFormBuilder,
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
      defaultPaymentMethod: [''],
      invoiceTerms: ['', Validators.required],
      enableInvoiceContact: [false],
      enableOwnerSending: [false],
      enableContactSending: [false],
      firstName: [
        { value: '', disabled: this.isDisable },
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
      ],
      lastName: [
        '',
        [Validators.maxLength(100)]
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
      condition: ['', [Validators.maxLength(400)]],
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
    this.invoiceTicketsService.getInvoiceSettings().subscribe(data => {
      this.invoiceSettings = new InvoiceSettings(data);
      this.isDisable = this.invoiceSettings.invoiceContact.enabled;
      const state = !this.isDisable ? 'disable' : 'enable';
      if (!this.isDisable) {
        Object.keys(this.invoiceForm.controls).forEach(controlName => {
          if (
            controlName !== 'invoiceCount' &&
            controlName !== 'invoiceTerms' &&
            controlName !== 'enableInvoiceContact' &&
            controlName !== 'taxIdDescription' &&
            controlName !== 'taxId' &&
            controlName !== 'condition'
          ) {
            this.invoiceForm.controls[controlName][state](); // disables/enables each form control based on 'this.formDisabled'
          }
        });
      }
      this.invoiceForm.patchValue({
        designation: this.invoiceSettings.invoiceContact.designation,
        email: this.invoiceSettings.invoiceContact.email,
        enableInvoiceContact: this.invoiceSettings.invoiceContact.enabled,
        enableOwnerSending: this.invoiceSettings.enableOwnerSending,
        firstName: this.invoiceSettings.invoiceContact.firstName,
        lastName: this.invoiceSettings.invoiceContact.lastName,
        enableContactSending: (!this.invoiceSettings.invoiceContact.enabled) ? true : this.invoiceSettings.invoiceContact.enableContactSending,
        invoiceTerms: this.invoiceSettings.term,
        defaultPaymentMethod: this.invoiceSettings.defaultPaymentMethod,
        condition: this.invoiceSettings.condition,
        invoiceCount: this.invoiceSettings.number,
        taxId: this.invoiceSettings.taxId,
        taxIdDescription: this.invoiceSettings.taxIdDescription
      });
      (<any>document.body.querySelector("#accounting-active")).checked = (!this.invoiceSettings.invoiceContact.enabled) ? true : this.invoiceSettings.invoiceContact.enableContactSending;
      const phoneNumbers = this.invoiceSettings.invoiceContact.phoneNumbers || [];
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
      this.invoiceTerm = this.invoiceTerms.find(item => item.type == this.invoiceSettings.term);
      this.paymentMethod = this.paymentMethods.find(item => item.value == this.invoiceSettings.defaultPaymentMethod);
      this.elRef.nativeElement.querySelector('#memo-invoice').value = this.invoiceSettings.condition;
      this.loading = false;
      this.appStateService.changeDetectorRef();
    })
  }
  onChangePrimaryPhoneType(data) {
    this.primaryPhoneType = data;
    this.invoiceForm.patchValue({
      primaryPhoneType: data.type,
    });
  }
  public onPastMemo(value) {
    this.invoiceForm.patchValue({ condition: value });
  }

  /**
  * Subscribe to change description
  * @param event - description event
  */
  public onChangeMemo(event) {
    this.invoiceForm.patchValue({ condition: event.target.value });
  }

  onInvoiceTermsChange(data) {
    this.invoiceTerm = data;
    this.invoiceForm.patchValue({ invoiceTerms: data.type });
  }

  onDefaultPaymentMethodChange(data) {
    this.paymentMethod = data;
    this.invoiceForm.patchValue({ defaultPaymentMethod: data.value });
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
      this.secondaryPhoneType = new TitleListType("Mobile", "MOBILE")
      this.invoiceForm.patchValue({
        secondaryPhoneType: 'MOBILE'
      });
    } else {
      this.invoiceForm.patchValue({
        secondaryPhone: '',
        secondaryPhoneType: '',
        secondaryId: ''
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
        controlName !== 'condition'
      ) {
        this.invoiceForm.controls[controlName][state](); // disables/enables each form control based on 'this.formDisabled'
      }
    });
    this.invoiceForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      designation: '',
      primaryPhone: '',
      secondaryPhone: '',
      secondaryPhoneType: '',
      secondaryId: ''
    });
    this.secondaryPhoneType = null;
    this.isAddPhone = false;

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
        termsAndConditions: this.invoiceForm.value.condition,
        type: 'INVOICE',
        enableOwnerSending: this.invoiceForm.value.enableOwnerSending,
        includeInvoiceAsAttachmentSetting: this.invoiceSettings.includeInvoiceAsAttachmentSetting,
        includeAccountReceivableReportAsAttachmentSetting: this.invoiceSettings.includeAccountReceivableReportAsAttachmentSetting,
        defaultPaymentMethod: this.invoiceForm.value.defaultPaymentMethod
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
