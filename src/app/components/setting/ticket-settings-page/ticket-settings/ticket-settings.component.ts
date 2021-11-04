import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceTicketsService } from '../../invoice-tickets/invoice-tickets.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';

@Component({
  selector: 'app-ticket-settings',
  templateUrl: './ticket-settings.component.html',
  styleUrls: ['./ticket-settings.component.scss']
})
export class TicketSettingsComponent implements OnInit {
  intervals = [new CompanySetting('1 minute', 'ONE_MINUTE'),
  new CompanySetting('5 minutes', 'FIVE_MINUTES'),
  new CompanySetting('10 minutes', 'TEN_MINUTES'),
  new CompanySetting('15 minutes', 'FIFTEEN_MINUTES')];
  timepickerTypes = [new CompanySetting('Start-End time picker', 'TIME_PICKER'),
  new CompanySetting('Duration picker', 'DURATION_PICKER')];
  @ViewChild('intervalsDp') intervalsDp: DropDownComponent;
  loading = false;
  submitted = false;
  used = false;
  ticketForm: FormGroup;
  nextValid: '';
  public currentUser: any;
  currentCompany: any;
  @Input() taxIdDescInput: any;
  @Input() taxIdInput: any;
  @Input() conditionInput: any;
  constructor(
    private formBuilder: FormBuilder,
    private invoiceTicketsService: InvoiceTicketsService,
    private userService: UsersService,
    private toastr: ToastrService,
    private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService
  ) { }

  /**
   * init
   */
  ngOnInit() {
    // get current user
    if (this.usersStateService.getCurrentUser()) this.currentUser = this.usersStateService.getCurrentUser();
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
    })


    this.ticketForm = this.formBuilder.group({
      ticketCount: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?([0-9]\d*)?$/)
        ])
      ],
      outliersTime: ['', Validators.compose([Validators.required])],
      timepickerType: ['DURATION_PICKER'],
      interval: ['FIVE_MINUTES'],
      // taxId: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.maxLength(15),
      //     Validators.pattern(/^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,15}$/)
      //   ]
      // ],
      // taxIdDescription: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.maxLength(15),
      //     Validators.pattern(/^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,15}$/)
      //   ]
      // ],
      // conditions: ['']
    });
    if (this.companiesStateService.getCurrentCompany()) this.getCurrentCompany(this.companiesStateService.getCurrentCompany());
    this.companiesStateService.onCurrentCompany.subscribe(res => {
      this.getCurrentCompany(res);
    })

    this.getActualNumber();
    // this.getTaxNumber();
    // this.getTermsAndConditions();
    this.ticketForm.patchValue({
      taxId: this.taxIdInput,
      taxIdDescription: this.taxIdDescInput
    });
    this.ticketForm.patchValue({
      conditions: this.conditionInput
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.ticketForm.controls;
  }

  /**
   * current comapny
   */
  getCurrentCompany(res) {
    let timepickerType = res.serviceExpenseDurationPresentation
      ? res.serviceExpenseDurationPresentation
      : 'DURATION_PICKER';
    let serviceExpenseDurationPickerInterval = res.serviceExpenseDurationPickerInterval
      ? res.serviceExpenseDurationPickerInterval
      : 'FIVE_MINUTES';
    this.ticketForm.patchValue({
      outliersTime: res.outliersSeconds
        ? res.outliersSeconds / 3600
        : null,
      timepickerType: timepickerType,
      interval: serviceExpenseDurationPickerInterval
    });
  }

  /**
   * get actual number
   */
  getActualNumber() {
    this.loading = true; $(".loading").css("display", "block");
    this.invoiceTicketsService.actualNumber('TICKET').subscribe(
      (res: any) => {
        this.loading = false; $(".loading").css("display", "none");
        if (res) {
          this.ticketForm.patchValue({
            ticketCount: res.number
          });
        }
      },
      error => { }
    );
  }

  /**
   * get tax number
   */
  getTaxNumber() {
    this.loading = true; $(".loading").css("display", "block");
    this.invoiceTicketsService.getTaxNumber().subscribe(
      (res: any) => {
        this.loading = false; $(".loading").css("display", "none");
        if (res) {
          this.ticketForm.patchValue({
            taxId: res.taxId,
            taxIdDescription: res.taxIdDescription
          });
        }
      },
      error => {
        this.loading = false; $(".loading").css("display", "none");
      }
    );
  }

  /**
   * get terms and conditions
   */
  getTermsAndConditions() {
    this.loading = true; $(".loading").css("display", "block");
    this.invoiceTicketsService.termsAndConditions().subscribe(
      (res: any) => {
        this.loading = false; $(".loading").css("display", "none");
        this.ticketForm.patchValue({
          conditions: res.conditions
        });
      },
      error => {
        this.loading = false; $(".loading").css("display", "none");
      }
    );
  }

  onChangeType(data) {
    this.ticketForm.patchValue({
      timepickerType: data.value,
      interval: data.value === 'DURATION_PICKER' ? 'FIVE_MINUTES' : 'ONE_MINUTE'
    });
    if (this.ticketForm.value.timepickerType === 'TIME_PICKER') {
      this.intervals = [new CompanySetting('1 minute', 'ONE_MINUTE'),
      new CompanySetting('5 minutes', 'FIVE_MINUTES'),
      new CompanySetting('10 minutes', 'TEN_MINUTES'),
      new CompanySetting('15 minutes', 'FIFTEEN_MINUTES')];
    } else {
      this.intervals = [
        new CompanySetting('5 minutes', 'FIVE_MINUTES'),
        new CompanySetting('10 minutes', 'TEN_MINUTES'),
        new CompanySetting('15 minutes', 'FIFTEEN_MINUTES')];
    }
    this.intervalsDp.reset(this.intervals);
  }
  onChangeInterval(data) {
    this.ticketForm.patchValue({
      interval: data.value
    });
  }
  getSelectedInterval() {
    return this.intervals.find(item => item.value === this.ticketForm.value.interval);
  }
  getSelectedTimepickerType() {
    return this.timepickerTypes.find(item => item.value === this.ticketForm.value.timepickerType);
  }
  /**
   * saved
   */
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.ticketForm.invalid) {
      return;
    }

    const objTicket = {
      emailSettingPageNumberFormDto: {
        count: this.ticketForm.value.ticketCount,
        prefix: '',
        type: 'TICKET',
        termsAndConditions: this.ticketForm.value.conditions
      },
      taxNumber: {
        taxIdDescription: this.ticketForm.value.taxIdDescription,
        taxId: this.ticketForm.value.taxId
      },
      serviceExpenseDurationDto: {
        presentation: this.ticketForm.value.timepickerType,
        interval: this.ticketForm.value.interval
      },
      companyWorkingTimeDto: {
        workingDays: null,
        outliersSeconds: this.ticketForm.value.outliersTime
          ? this.ticketForm.value.outliersTime * 3600
          : null
      }
    };
    this.loading = true; $(".loading").css("display", "block");
    this.invoiceTicketsService.updateTicketsetting(objTicket).subscribe(
      (res: any) => {
        this.loading = false; $(".loading").css("display", "none");
        this.toastr.success('Saved Successfully');
        if (res && res.code === 409) {
          this.nextValid = res.message;
          this.ticketForm.patchValue({
            count: this.ticketForm.value.ticketCount
          });
        }
      },
      error => {
        this.loading = false; $(".loading").css("display", "none");
        this.toastr.error('Bad Request');
      }
    );
  }
}
