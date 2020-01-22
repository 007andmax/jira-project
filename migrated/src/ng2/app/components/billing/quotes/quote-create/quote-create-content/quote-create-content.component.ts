import {Component, Input, OnInit, OnDestroy} from '@angular/core';
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
  public selectedClient: any;
  private quoteNumber: number;
  private apiUrl = environment.apiUrl;
  @Input() editMode: any;
  private unsubscribe: Subject<void> = new Subject();

  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   
   * @param {FormBuilder} fb Service to work with forms
   * @param {DateService} dateService Service to work with date
   * @param {QuoteService} quoteService to work with api
   * @param {QuoteStateService} quoteStateService to work quote state
   */
  constructor(
    
    private fb: FormBuilder,
    private dateService: DateService,
    private quoteService: QuoteService,
    private quoteStateService: QuoteStateService
  ) { }

  /**
   * Initializes quotes content. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    
    if (this.editMode) {
      this.onInitEditMode();
    } else {
      this.getQuoteNumber();
     
    }
    this.initForm(this.editMode);
    this.handleSendMode();
  }

   /**
   * Initializes edit mode.
   */
  private onInitEditMode() {
    this.quoteNumber = this.quoteStateService.quoteForCreate.quoteNumber;
    this.quoteStateService.setNumber(this.quoteNumber);
  }

  /**
   * Get free quotes number
   */
  private getQuoteNumber() {
    this.quoteService.getQuoteNumber().subscribe((res) => {
      this.quoteNumber = (res['number']) ? res['number'] : 1;
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
      this.onInitChengeForm();
    }
  }

 /**
   * Initialized check quotes form on change
   */
  public onInitChengeForm () {
    this.quoteForm.valueChanges.subscribe(val => {
      this.quoteStateService.setError(null);
    });
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
          this.quoteService.editQuote(currentQuote, currentQuote['id'], true)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
              this.quoteStateService.goToQuote();
            })
        } else {
          this.quoteService.editQuote(currentQuote, currentQuote['id'], false)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
              this.quoteStateService.goToQuote();
            })
        }
      } else {
        console.log('currentQuote',currentQuote);
        if (notification) {
          this.quoteService.createQuote(currentQuote, true)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
          
              this.quoteStateService.goToQuote();
            })
        } else {
          this.quoteService.createQuote(currentQuote, false)
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

  /**
   * Create quote and approve
   */
  approveQuote() {
    const isFormReady = this.quoteStateService.getType();
    const currentQuote = this.quoteStateService.getQuoteCreate();
    if (isFormReady && this.editMode && currentQuote['id']) {
  
      this.quoteService.editQuote(currentQuote, currentQuote['id'], true)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.quoteService.approveQuote(res['company'], res['id'])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
              this.quoteStateService.goToQuote();
            });
      })
    } else if (isFormReady) {
     
      this.quoteService.createQuote(currentQuote, false)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.quoteService.approveQuote(res['company'], res['id'])
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((res) => {
            this.quoteStateService.goToQuote();
          });
    })
  } else {
      this.quoteStateService.emitValidation();
    }
  }

  /**
   * Create quote and download
   */
  public downloadPdf() {
    const isFormReady = this.quoteStateService.getType();
    console.log('isFormReady',isFormReady);
    const currentQuote = this.quoteStateService.getQuoteCreate();
    if (isFormReady && this.editMode && currentQuote.id) {
    
      this.quoteService.editQuote(currentQuote, currentQuote['id'], true)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        const id = res['id'];
        this.quoteService.downloadPdf(res['id']).subscribe((res) =>{
          this.quoteService.downLoadFile(res, id,this.quoteStateService.getQuoteCreate().client.name,this.quoteNumber)
          this.quoteService.backToQuoteList();
        });
      })
    } else if (isFormReady)  {
      this.quoteService.createQuote(currentQuote, false).pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        const id = res['id'];
        this.quoteService.downloadPdf(res['id']).subscribe((res) => {
          this.quoteService.downLoadFile(res, id,this.quoteStateService.getQuoteCreate().client.name,this.quoteNumber);
          this.quoteService.backToQuoteList();
        });
      })
    }  else {
      this.quoteStateService.emitValidation();
    }

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
    console.log('value',value);
  }

  /**
   * Set global note for quote
   */
  public setGlobalNote(value) {
    this.quoteForm.controls['globalNote'].setValue(value);
  }

  /**
   * Save and continue in hande end modee
   */
  public handleSendMode() {
    this.quoteStateService.handleSendMode
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.saveAndContinue(true);
      })
  }

  /**
   * Deestroy quotes component
   */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.quoteStateService.setQuoteForm(this.quoteForm);
  }

}
