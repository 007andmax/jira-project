import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceTicketsService } from '../invoice-tickets.service';
import { UsersService } from 'src/ng2/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ticket-settings',
  templateUrl: './ticket-settings.component.html',
  styleUrls: ['./ticket-settings.component.scss']
})
export class TicketSettingsComponent implements OnInit {
  loading = false;
  submitted = false;
  used = false;
  ticketForm: FormGroup;
  nextValid: '';
  public currentUser: any;
  currentCompany: any;

  constructor(
    private formBuilder: FormBuilder,
    private invoiceTicketsService: InvoiceTicketsService,
    private userService: UsersService,
    private toastr: ToastrService
  ) {}

  /**
   * init
   */
  ngOnInit() {
    // get current user
    this.currentUser = this.userService.currentUser;

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

    this.getCurrentCompany();
    this.getActualNumber();
    this.getTaxNumber();
    this.getTermsAndConditions();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.ticketForm.controls;
  }

  /**
   * current comapny
   */
  getCurrentCompany() {
    this.invoiceTicketsService.currentCompany().subscribe(
      (res: any) => {
        if (res) {
          this.ticketForm.patchValue({
            outliersTime: res.outliersSeconds
              ? res.outliersSeconds / 3600
              : null,
            timepickerType: res.serviceExpenseDurationPresentation
              ? res.serviceExpenseDurationPresentation
              : 'DURATION_PICKER'
          });
        }
      },
      error => {}
    );
  }

  /**
   * get actual number
   */
  getActualNumber() {
    this.loading = true;$(".loading").css("display", "block");
    this.invoiceTicketsService.actualNumber('TICKET').subscribe(
      (res: any) => {
        this.loading = false;$(".loading").css("display", "none");
        if (res) {
          this.ticketForm.patchValue({
            ticketCount: res.number
          });
        }
      },
      error => {}
    );
  }

  /**
   * get tax number
   */
  getTaxNumber() {
    this.loading = true;$(".loading").css("display", "block");
    this.invoiceTicketsService.getTaxNumber().subscribe(
      (res: any) => {
        this.loading = false;$(".loading").css("display", "none");
        if (res) {
          this.ticketForm.patchValue({
            taxId: res.taxId,
            taxIdDescription: res.taxIdDescription
          });
        }
      },
      error => {
        this.loading = false;$(".loading").css("display", "none");
      }
    );
  }

  /**
   * get terms and conditions
   */
  getTermsAndConditions() {
    this.loading = true;$(".loading").css("display", "block");
    this.invoiceTicketsService.termsAndConditions().subscribe(
      (res: any) => {
        this.loading = false;$(".loading").css("display", "none");
        this.ticketForm.patchValue({
          conditions: res.conditions
        });
      },
      error => {
        this.loading = false;$(".loading").css("display", "none");
      }
    );
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
        interval: null
      },
      companyWorkingTimeDto: {
        workingDays: null,
        outliersSeconds: this.ticketForm.value.outliersTime
          ? this.ticketForm.value.outliersTime * 3600
          : null
      }
    };
    this.loading = true;$(".loading").css("display", "block");
    this.invoiceTicketsService.updateTicketsetting(objTicket).subscribe(
      (res: any) => {
        this.loading = false;$(".loading").css("display", "none");
        this.toastr.success('Saved Successfully');
        if (res && res.code === 409) {
          this.nextValid = res.message;
          this.ticketForm.patchValue({
            count: this.ticketForm.value.ticketCount
          });
        }
      },
      error => {
        this.loading = false;$(".loading").css("display", "none");
        this.toastr.error('Bad Request');
      }
    );
  }
}
