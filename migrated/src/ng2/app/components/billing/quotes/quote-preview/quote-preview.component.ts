import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { QuoteStateService } from "../quote-create/quote-state.service";
import { CompaniesService } from "../../../../services/company/companies.service";
import { DateService } from "../../../../services/date/date.service";
import { QuoteCreateContentComponent } from "../quote-create/quote-create-content/quote-create-content.component";
import { QuoteService } from "../../../../services/quote/quote.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { ModalQuoteComponent } from "../../../../services/modal/modal-quote/modal-quote.component";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from '@angular/forms';
import { ISubscription } from 'rxjs/Subscription';
import { AlertStateService } from '../../../shared/alert/services/alert-state.service';

/**
 * Quote preview component
 */
@Component({
  selector: 'app-quote-preview',
  templateUrl: './quote-preview.component.html',
  styleUrls: ['./quote-preview.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class QuotePreviewComponent implements OnInit {

  public quote: any;
  public quoteForCreate: any;
  public company: any;
  public itemsArray = [];
  public editable: any;
  public editMode: boolean;
  private apiUrl = environment.apiUrl;
  @Output() saveAndContinue = new EventEmitter<string>();
  public stopCache = Math.floor(Math.random() * 100000);
  private unsubscribe: Subject<void> = new Subject();
  public quoteForm: FormGroup;
  @ViewChild(QuoteCreateContentComponent) quoteCreateContentComponent: QuoteCreateContentComponent;

  /**
   * Creates an instance of the QuoteCreateContentComponent with the injected services
   * @param {CompaniesService} companiesService Service to work with api
   * @param {NgbModal} modalService Service to work with modl
   * @param {DateService} dateService Service to work with date
   * @param {QuoteService} quoteService to work with api
   * @param {QuoteStateService} quoteStateService to work quote state
   */
  constructor(
    private quoteStateService: QuoteStateService,
    private companiesService: CompaniesService,
    private dateService: DateService,
    private quoteService: QuoteService,
    private modalService: NgbModal,
    private alertState: AlertStateService,
    config: NgbModalConfig,
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  /**
   * Initializes quotes preview. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getQuoteInfo();
    this.getCurrentCompany();
    this.getItemsArray();
    this.editable = this.quoteStateService.getState().params.editable;
    this.editMode = this.quoteStateService.getState().params.editMode;
    this.handleSendMode();
    if (this.editMode) this.quoteForm = this.quoteStateService.getQuoteForm();
    this.quote.client = this.quoteStateService.getClent();
  }

  /**
   * get Quote info for preview
   */
  public getQuoteInfo() {
    this.quote = this.quoteStateService.getQuote();
    this.quoteForCreate = this.quoteStateService.getQuoteCreate();
    console.log('this.quoteForCreate',this.quoteForCreate);
  }

  /**
   * get quote compny
   */
  public getCurrentCompany() {
    this.companiesService.getTechCompany().subscribe((res) => {
      return this.company = res;
    });
  }

  /**
   * get client user name
   */
  public getCLientUserName(companyInfo) {
    return `${companyInfo.contacts[0].firstName} ${companyInfo.contacts[0].lastName}`
  }

  /**
   * get client address
   */
  public getCLientAddress(companyInfo) {
    return `${companyInfo.addresses[0].address}`
  }

  /**
   * get items array
   */
  public getItemsArray() {
    this.itemsArray = this.quoteStateService.getItemArray();
  }

  /**
   * get price
   */
  public getPrice(cost, count, tax) {
    return this.roundToTwo(this.quoteStateService.getPrice(cost, count, tax));
  }

  /**
   * get tax price
   */
  public getTaxPrice(cost, count, tax) {
    return this.roundToTwo(this.quoteStateService.getTaxPrice(cost, count, tax));
  }

  /**
   * get rounded number
   */
  public roundToTwo(num) {
    return parseFloat((Math.round(Number(num + 'e+2')) + "e-2")).toFixed(2);
  }

  /**
   * get formated date
   */
  public getFormatDate(date) {
    if (date) {
      date = `${date.year}/${date.month}/${date.day}`;
      return this.dateService.getInvoiceDate(date);
    } else {
      return ''
    }
  }

  /**
   * get global note
   */
  public getGlobalNote() {
    if (this.quoteForCreate.globalNote.hasOwnProperty('line1')) {
      return this.quoteForCreate.globalNote.line1
    } else {
      return this.quoteForCreate.globalNote
    }
  }

  /**
   * go to create state
   */
  goToCreate() {
    this.quoteStateService.goToState('quote-create-component', { editMode: true });
  }

  /**
   * Create quote and save
   */
  public save() {
    const isFormReady = this.quoteStateService.getType();
    if (isFormReady) {
      if (this.editMode) {
        this.quoteService.editQuote(this.quoteForm.value, this.quoteForCreate.id, false)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.quoteStateService.goToQuote();
        })
      } else {
        this.quoteService.createQuote({
          client: this.quote.client,
          startDate: this.quoteForCreate.startDate,
          endDate: this.quoteForCreate.endDate,
          globalNote: this.quoteForCreate.globalNote,
          regularNote: this.quoteForCreate.selectedNote
        }, false).subscribe();
      }
    } else {
      this.quoteStateService.emitValidation();
    }
  }

  /**
   * Create quote and approve
   */
  public approveQuote() {

    const isFormReady = this.quoteStateService.getType();
    if (isFormReady && !this.editMode) {
      this.quoteService.createQuote({
        client: this.quote.client,
        startDate: this.quoteForCreate.endDate,
        endDate: this.quoteForCreate.startDate,
        globalNote: this.quoteForCreate.globalNote,
        regularNote: this.quoteForCreate.selectedNote
      }, false)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.quoteService.approveQuote(res['company'], res['id'])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
              this.quoteStateService.goToQuote();
            });
        });
    } else if (isFormReady && this.editMode) {
      const currentQuote = this.quoteStateService.getQuoteCreate();
      this.quoteService.editQuote(this.quoteForm.value, currentQuote['id'], true)
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

  onlySend() {
    const modalRef = this.modalService.open(ModalQuoteComponent, null);
    modalRef.componentInstance.data = this.quoteForCreate;
    modalRef.componentInstance.onlySendMode = true;
  }
  onlyDownloadPdf () {
    
    this.quoteService.downloadPdf(this.quoteForCreate.id).subscribe((res) => this.quoteService.downLoadFile(res, this.quoteForCreate.id,this.quote.client.name,this.quoteForCreate.quoteNumber));
    
  }

  /**
   * Create quote and approve
   */
  public downloadPdf() {
    const isFormReady = this.quoteStateService.getType();
    if (isFormReady && !this.editMode) {
      this.quoteService.createQuote({
        client: this.quote.client,
        startDate: this.quoteForCreate.endDate,
        endDate: this.quoteForCreate.startDate,
        globalNote: this.quoteForCreate.globalNote,
        regularNote: this.quoteForCreate.selectedNote
      }, false)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          const id = res['id'];
          this.quoteService.downloadPdf(res['id']).subscribe((res) => {
            this.quoteService.downLoadFile(res, id,this.quote.client.name,this.quoteForCreate.quoteNumber);
            this.alertState.oninitShowAlert('Quote has been saved');
            this.quoteService.backToQuoteList();
          });
        });
    } else if (isFormReady && this.editMode) {
      const currentQuote = this.quoteStateService.getQuoteCreate();
      this.quoteService.editQuote(this.quoteForm.value, currentQuote['id'], true)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        const id = res['id'];
        this.quoteService.downloadPdf(res['id']).subscribe((res) => {
          this.quoteService.downLoadFile(res, id,this.quote.client.name,this.quoteForCreate.quoteNumber)
          this.alertState.oninitShowAlert('Quote has been saved');
          this.quoteService.backToQuoteList();
        })
      })
    } else {
      this.quoteStateService.emitValidation();
    }
  }

  /**
   * save quote and open send modal
   */
  public saveAndSend() {
    const modalRef = this.modalService.open(ModalQuoteComponent, this.quoteForCreate);
    modalRef.componentInstance.data = this.quoteForCreate;
  }

  /**
   * Return to quotes
   */
  public goToQuotes() {
    this.quoteStateService.goToState('quotes-component');
  }

  /**
   * hande send modee
   */
  public handleSendMode() {
    this.quoteStateService.handleSendMode
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.saveAndContinueMode(true);
      })
  }

  public trackById(index, item) {
    return item.id;
  }

  /**
   * Get user first and last name
   * @param firstName first name
   * @param lastName last name
   */
  public getUserWhoSend(firstName,lastName) {
    return `${firstName} ${lastName}`;
  }
  /**
   * Create quote
   */
  saveAndContinueMode(notification?: boolean) {
    const isFormReady = this.quoteStateService.getType();
    const currentQuote = this.quoteStateService.getQuoteCreate();
    if (notification) {
      this.quoteService.createQuote(this.quoteForCreate, true)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.quoteStateService.goToQuote();
        })
    } else {
      this.quoteService.createQuote(this.quoteForCreate, false)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.quoteStateService.goToQuote();
        })
    }
  }

   /**
   * Get format date
   * @param date date
   * @param milisecond milisecond
   */
  public getFormatDateWithTime (date,milisecond) {
    if (date) {
      let full_date = new Date(milisecond);
      let time = full_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      date = `${date.year}/${date.month}/${date.day}`;
      return `${this.dateService.getInvoiceDate(date)} ${time}`;
    } else {
      return ''
    }
  }

  /**
   * Destroy preview component
   */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
