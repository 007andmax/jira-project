import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceTicketsService } from '../invoice-tickets.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ticket-settings',
  templateUrl: './ticket-settings.component.html',
  styleUrls: ['./ticket-settings.component.scss']
})
export class TicketSettingsComponent implements OnInit {
  loading = false;
  submitted = false;
  ticketForm: FormGroup;
  nextValid: '';

  taxIdData = {
    taxIdDescription: '',
    taxId: ''
  };

  updateTicketForm = {
    count: '',
    prefix: '',
    type: '',
    nextValid: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private invoiceTicketsService: InvoiceTicketsService
  ) {}

  ngOnInit() {
    this.ticketForm = this.formBuilder.group({
      ticketCount: ['', Validators.required],
      outliersTime: ['', Validators.required],
      timepickerType: ['TIME_PICKER', Validators.required],
      taxId: [
        '',
        [
          Validators.maxLength(15),
          Validators.pattern(/^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,15}$/)
        ]
      ],
      taxIdDescription: [
        '',
        [
          Validators.maxLength(15),
          Validators.pattern(/^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,15}$/)
        ]
      ],
      conditions: ['']
    });

    this.getActualNumber();
    this.getTaxNumber();
    this.getTermsAndConditions();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.ticketForm.controls;
  }

  getActualNumber() {
    this.invoiceTicketsService.actualNumber('TICKET').subscribe(
      (res: any) => {
        this.ticketForm.patchValue({
          ticketCount: res.number
        });
      },
      error => {}
    );
  }

  getTaxNumber() {
    this.invoiceTicketsService.getTaxNumber().subscribe(
      (res: any) => {
        if (res) {
          this.ticketForm.patchValue({
            taxId: res.taxId,
            taxIdDescription: res.taxIdDescription
          });
        }
      },
      error => {}
    );
  }

  getTermsAndConditions() {
    this.invoiceTicketsService.termsAndConditions().subscribe(
      (res: any) => {
        this.ticketForm.patchValue({
          conditions: res.conditions
        });
      },
      error => {}
    );
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.ticketForm.invalid) {
      return;
    }

    this.taxIdData.taxId = this.ticketForm.value.taxId;
    this.taxIdData.taxIdDescription = this.ticketForm.value.taxIdDescription;

    this.loading = true;

    this.invoiceTicketsService.TaxNumber(this.taxIdData).subscribe(
      res => {
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );

    this.updateTicketForm.count = this.ticketForm.value.ticketCount;
    this.updateTicketForm.prefix = '';
    (this.updateTicketForm.type = this.ticketForm.value.timepickerType),
      (this.updateTicketForm.nextValid = this.nextValid);

    this.invoiceTicketsService
      .updateTicketForm(this.updateTicketForm)
      .subscribe(
        (res: any) => {
          this.loading = false;
          if (res && res.code === 409) {
            this.nextValid = res.message;
            this.ticketForm.patchValue({
              count: this.ticketForm.value.ticketCount
            });
          }
        },
        error => {
          this.loading = false;
        }
      );
  }
}
