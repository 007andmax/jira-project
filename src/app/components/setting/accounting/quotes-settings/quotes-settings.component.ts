import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvoiceTicketsService } from '../../../../services/accounting/accounting-settings.service';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';

@Component({
  selector: 'app-quotes-settings',
  templateUrl: './quotes-settings.component.html',
  styleUrls: ['./quotes-settings.component.scss']
})
export class QuotesSettingsComponent implements OnInit {
  quotesForm: FormGroup;
  submitted = false;
  loading = true;
  expirationDate;
  expirationDates = [new TitleListType("1 day", "1"),
  new TitleListType("7 days", "7"),
  new TitleListType("14 days", "14"),
  new TitleListType("30 days", "30"),
  new TitleListType("45 days", "45")];
  constructor(
    private formBuilder: FormBuilder,
    private invoiceTicketsService: InvoiceTicketsService,
    private toastr: ToastrService,
    private appStateService: AppStateService
  ) { }

  ngOnInit() {
    this.getActualNumber();

    this.quotesForm = this.formBuilder.group({
      count: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?([0-9]\d*)?$/),
          Validators.maxLength(7)
        ])
      ],
      quoteExpirationDate: [
        ''
      ],
      defaultTerms: ['15days'],
      memoQuote: ['']
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.quotesForm.controls;
  }

  onDefaultExpirationDate(data) {
    console.log("data", data);
    this.quotesForm.patchValue({
      quoteExpirationDate: data.type,
    });
    console.log("this.quotesForm.value", this.quotesForm.value);
    this.expirationDate = data;
  }
  /**
   * get quote number
   */
  getActualNumber() {
    this.invoiceTicketsService.getQuoteSettings().subscribe(
      (res: any) => {
        this.loading = false;
        if (res) {
          this.quotesForm.patchValue({
            count: res.number,
            quoteExpirationDate: res.quoteExpirationDate
          });
          this.expirationDate = this.expirationDates.find(item => item.type == res.quoteExpirationDate);
          console.log("this.expirationDate", this.expirationDate);
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
    console.log("this.quotesForm.value", this.quotesForm.value);
    const objQuotes = {
      emailSettingPageNumberFormDto: {
        count: this.quotesForm.value.count,
        prefix: '',
        type: 'SALE_QUOTE',
        expirationDate: Number(this.quotesForm.value.quoteExpirationDate)
      }
    };
    this.invoiceTicketsService
      .updateQuotesSettings(objQuotes)
      .subscribe(res => {
        this.toastr.success('Saved Successfully');
        this.appStateService.changeDetectorRef();
      }, error => {
        this.toastr.error('Bad Request');
        this.appStateService.changeDetectorRef();
      });
  }
}
