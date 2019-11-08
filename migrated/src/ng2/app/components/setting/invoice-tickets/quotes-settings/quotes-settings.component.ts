import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceTicketsService } from '../invoice-tickets.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-quotes-settings',
  templateUrl: './quotes-settings.component.html',
  styleUrls: ['./quotes-settings.component.scss']
})
export class QuotesSettingsComponent implements OnInit {
  quotesForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private invoiceTicketsService: InvoiceTicketsService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getActualNumber();

    this.quotesForm = this.formBuilder.group({
      count: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?([0-9]\d*)?$/)
        ])
      ],
      defaultTerms: [''],
      memoQuote: ['']
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.quotesForm.controls;
  }

  /**
   * get quote number
   */
  getActualNumber() {
    this.loading = true;
    this.invoiceTicketsService.actualNumber('SALE_QUOTE').subscribe(
      (res: any) => {
        this.loading = false;
        if (res) {
          this.quotesForm.patchValue({
            count: res.number
          });
        }
      },
      error => {
        this.loading = false;
      }
    );
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.quotesForm.invalid) {
      return;
    }
    const objQuotes = {
      emailSettingPageNumberFormDto: {
        count: this.quotesForm.value.count,
        prefix: '',
        type: 'SALE_QUOTE'
      }
    };
    this.loading = true;
    this.invoiceTicketsService
      .updateQuotesSettings(objQuotes)
      .subscribe(res => {
        this.loading = false;
        this.toastr.success('Saved successfully');
      }, error => {
        this.loading = false;
        this.toastr.error(`Error occured ${error}`);
      });
  }
}
