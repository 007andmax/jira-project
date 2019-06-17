import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { DateService } from "../../../../../services/date/date.service";
import { CompaniesService } from "../../../../../services/company/companies.service";
import { QuoteService } from "../../../../../services/quote/quote.service";
import { QuoteStateService } from "../quote-state.service";
import {environment} from "../../../../../../environments/environment";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

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
  private apiUrl = environment.apiUrl;
  @Input() editMode: any;
  private unsubscribe: Subject<void> = new Subject();

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
    this.handeSendMode();
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
    } else {
      this.quoteForm = this.fb.group({
        client: ['', Validators.required],
        startDate: this.dateService.getStartDate(new Date()),
        endDate: this.dateService.getStartDate(new Date().getTime() + this.fifteenDays),
        partialDeposit: '',
        purchaseOrder: '',
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
      startDate: this.dateService.getStartDate(new Date(this.dateService.getDateFromBootstrap(quote.startDate))),
      endDate: this.dateService.getStartDate(new Date(this.dateService.getDateFromBootstrap(quote.endDate))),
      partialDeposit: '',
      quoteNumber: quote.quoteNumber,
      po: '',
      regularNote: '',
      globalNote: '',
      purchaseOrder: ''
    });
  }

  /**
   * Create quote
   */
  saveAndContinue(notification?: boolean) {
    const isFormReady = this.quoteStateService.getType();
    const currentQuote = this.quoteStateService.getQuoteCreate();
    if (isFormReady) {
      if (this.editMode && currentQuote && currentQuote['id']) {
        if (notification) {
          this.quoteService.editQuote(this.quoteForm.value, currentQuote['id'], true)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
              this.quoteStateService.goToQuote();
            })
        } else {
          this.quoteService.editQuote(this.quoteForm.value, currentQuote['id'], false)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
              this.quoteStateService.goToQuote();
            })
        }
      } else {
        if (notification) {
          this.quoteService.createQuote(this.quoteForm.value, true)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
              console.log('0000012315');
              this.quoteStateService.goToQuote();
            })
        } else {
          this.quoteService.createQuote(this.quoteForm.value, false)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
              this.quoteStateService.goToQuote();
          })
        }
      }
    } else {
      this.quoteStateService.emitValidation();
    }
  }

  approveQuote() {
    const isFormReady = this.quoteStateService.getType();
    isFormReady ?
      this.quoteService.createQuote(this.quoteForm.value, false)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.quoteService.approveQuote(res['company'], res['id'])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
              this.quoteStateService.goToQuote();
            });
      })
      : this.quoteStateService.emitValidation();
  }

  public downloadPdf() {
    const isFormReady = this.quoteStateService.getType();
    isFormReady ?
      this.quoteService.createQuote(this.quoteForm.value, false).pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          const id = res['id'];
          this.quoteService.downloadPdf(res['id']).subscribe((res) => this.downLoadFile(res,id));
        })
        : this.quoteStateService.emitValidation();

  }


  /**
   * Method is use to download file.
   * @param res - Array Buffer data
   * @param id - type of the document.
   */
  downLoadFile(res: any, id) {
    const data = window.URL.createObjectURL(res);
    var link = document.createElement('a');
    link.href = data;
    link.download=`${this.apiUrl}saleQuotes/${id}/pdf.pdf`;
    link.click();
    this.quoteStateService.goToQuote();
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

  public handeSendMode() {
    this.quoteStateService.handeSendMode
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.saveAndContinue(true);
      })
  }

  onChanges(): void {
    console.log('23421');
    this.quoteForm.valueChanges.subscribe(val => {
      console.log('1235235');
    });
  }

  ngOnDestroy() {
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }



}
