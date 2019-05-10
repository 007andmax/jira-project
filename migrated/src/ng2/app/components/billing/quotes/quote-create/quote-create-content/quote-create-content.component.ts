import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { DateService } from "../../../../../services/date/date.service";
import { CompaniesService } from "../../../../../services/company/companies.service";
import { QuoteService } from "../../../../../services/quote/quote.service";
import { map } from "rxjs/operators";

/**
 *  Quotes content component
 */
@Component({
  selector: 'app-quote-create-content',
  templateUrl: './quote-create-content.component.html',
  styleUrls: ['./quote-create-content.component.scss']
})
export class QuoteCreateContentComponent implements OnInit {

  public quoteForm: FormGroup;
  public fifteenDays = 1296000000;
  private selectedClient: any;

  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   * @param {CompaniesService} companiesService Service to work with api
   * @param {FormBuilder} fb Service to work with forms
   * @param {DateService} dateService Service to work with date
   * @param {QuoteService} quoteService to work with api
   */
  constructor(
    private companiesService: CompaniesService,
    private fb: FormBuilder,
    private dateService: DateService,
    private quoteService: QuoteService
  ) { }

  /**
   * Initializes quotes content. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.companiesService.getCompaniesList();
    this.getQuoteNumber();
    this.initForm();
  }

  /**
   * Get free quotes number
   */
  private getQuoteNumber() {
    this.quoteService.getQuoteNumber().pipe(map((res) => {
      console.log(res, 'ITEM');
    })).subscribe();
  }

  /**
   * Initialized create quotes form
   */
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

  /**
   * Create quote
   */
  saveAndContinue() {
    this.quoteService.createQuote(this.quoteForm.value).subscribe();
  }

  /**
   * Set client for quote
   */
  public setClient(value) {
    this.quoteForm.controls['client'].setValue(value);
    this.selectedClient = value.item;

  }

  /**
   * Set regular note for quote
   */
  public setRegularNote(value) {
    this.quoteForm.controls['regularNote'].setValue(value);
  }

  /**
   * Set global note for quote
   */
  public setGlobalNote(value) {
    this.quoteForm.controls['globalNote'].setValue(value);
  }

}
