import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { DateService } from "../../../../../services/date/date.service";
import { CompaniesService } from "../../../../../services/company/companies.service";
import { QuoteService } from "../../../../../services/quote/quote.service";
import { QuoteStateService } from "../quote-state.service";

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
  private quoteNumber: number;
  @Input() editMode: any;

  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   * @param {CompaniesService} companiesService Service to work with api
   * @param {FormBuilder} fb Service to work with forms
   * @param {DateService} dateService Service to work with date
   * @param {QuoteService} quoteService to work with api
   * @param {QuoteStateService} quoteStateService to work quote state
   */
  constructor(
    private companiesService: CompaniesService,
    private fb: FormBuilder,
    private dateService: DateService,
    private quoteService: QuoteService,
    private quoteStateService: QuoteStateService
  ) { }

  /**
   * Initializes quotes content. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.companiesService.getCompaniesList();
    this.getQuoteNumber();
    this.initForm(this.editMode);
  }

  /**
   * Get free quotes number
   */
  private getQuoteNumber() {
    this.quoteService.getQuoteNumber().subscribe((res) => {
      this.quoteNumber = res['number'];
      this.quoteStateService.setNumber(this.quoteNumber);
    });
  }

  /**
   * Initialized create quotes form
   */
  public initForm(editMode?) {
    if (editMode) {
      this.initEditMode();
      this.selectedClient
    } else {
      this.quoteForm = this.fb.group({
        client: ['', Validators.required],
        startDate: this.dateService.getStartDate(new Date()),
        endDate: this.dateService.getStartDate(new Date().getTime() + this.fifteenDays),
        partialDeposit: '',
        quoteNumber: this.quoteNumber,
        po: '',
        regularNote: '',
        globalNote: ''
      })
    }
  }

  /**
   * Initialized create quotes form for edit mode
   */
  public initEditMode() {
    const quote = this.quoteStateService.getQuoteCreate();
    this.quoteForm = this.fb.group({
      client: [this.quoteStateService.getClient(), Validators.required],
      startDate: this.dateService.getStartDate(new Date(this.dateService.getMs(quote.startDate))),
      endDate: this.dateService.getStartDate(new Date(this.dateService.getMs(quote.endDate))),
      partialDeposit: '',
      quoteNumber: quote.quoteNumber,
      po: '',
      regularNote: '',
      globalNote: ''
    });
    console.log(this.quoteForm, 'quoteForm');
  }

  /**
   * Create quote
   */
  saveAndContinue() {
    const isFormReady = this.quoteStateService.getType();
    isFormReady ?
      this.quoteService.createQuote(this.quoteForm.value).subscribe((res) => {
        this.quoteStateService.goToQuote();
        })
      : this.quoteStateService.emitValidation();
  }

  /**
   * Create quote and convert to invoice
   */
  convertToInvoice() {
    const isFormReady = this.quoteStateService.getType();
    isFormReady ?
      this.quoteService.createQuote(this.quoteForm.value).subscribe((res) => {
        console.log(res, 'RES');
        this.quoteService.convertToInvoice(res['company'].id, res['id']).subscribe((res) => {
          this.quoteStateService.goToQuote();
        });
      })
      : this.quoteStateService.emitValidation();
  }

  /**
   * Create quote and convert to ticket
   */
  convertToTicket() {
    const isFormReady = this.quoteStateService.getType();
    isFormReady ?
      this.quoteService.createQuote(this.quoteForm.value).subscribe((res) => {
        this.quoteService.convertToTicket(res['company'].id, res['id']).subscribe((res) => {
          this.quoteStateService.goToQuote();
        });
      })
      : this.quoteStateService.emitValidation();
  }

  approveQuote() {
    const isFormReady = this.quoteStateService.getType();
    isFormReady ?
      this.quoteService.createQuote(this.quoteForm.value).subscribe((res) => {
        this.quoteService.approveQuote(res['company'].id, res['id']).subscribe((res) => {
          this.quoteStateService.goToQuote();
        });
      })
      : this.quoteStateService.emitValidation();
  }

  public downloadPdf() {
    const isFormReady = this.quoteStateService.getType();
    isFormReady ?
      this.quoteService.createQuote(this.quoteForm.value).subscribe((res) => {
        this.quoteService.downloadPdf(res['id']).subscribe((res) => {
          this.quoteStateService.goToQuote();
        });
      })
      : this.quoteStateService.emitValidation();

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
