import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { DateService } from "../../../../../services/date/date.service";
import { CompaniesService } from "../../../../../services/company/companies.service";
import { QuoteService } from "../../../../../services/quote/quote.service";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-quote-create-content',
  templateUrl: './quote-create-content.component.html',
  styleUrls: ['./quote-create-content.component.scss']
})
export class QuoteCreateContentComponent implements OnInit {

  public quoteForm: FormGroup;
  public fifteenDays = 1296000000;

  constructor(
    private companiesService: CompaniesService,
    private fb: FormBuilder,
    private dateService: DateService,
    private quoteService: QuoteService
  ) { }

  ngOnInit() {
    this.companiesService.getCompaniesList();
    this.getQuoteNumber();
    this.initForm();
  }

  private getQuoteNumber() {
    console.log('test');
    this.quoteService.getQuoteNumber().pipe(map((res) => {
      console.log(res, 'ITEM');
    })).subscribe();
  }

  public initForm() {
    console.log(this.dateService.getStartDate(new Date()), 'this.dateService.getStartDate(new Date())');
    this.quoteForm = this.fb.group({
      client: ['', Validators.required],
      startDate: this.dateService.getStartDate(new Date()),
      endDate: this.dateService.getStartDate(new Date().getTime() + this.fifteenDays),
      partialDeposit: '',
      quoteNumber: '',
      po: '',
      regularNote: '',
      globalNote: ''
    })
  }

  saveAndContinue() {
    this.quoteService.createQuote(this.quoteForm.value).subscribe();
    console.log(this.quoteForm.value);
  }

  public setClient(value) {
    this.quoteForm.controls['client'].setValue(value);
  }

  public setRegularNote(value) {
    this.quoteForm.controls['regularNote'].setValue(value);
  }

  public setGlobalNote(value) {
    this.quoteForm.controls['globalNote'].setValue(value);
  }

}
