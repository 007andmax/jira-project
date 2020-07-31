import { Component, EventEmitter, Output, Input } from '@angular/core';
import { QuoteStateService } from "../quote-state.service";
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalQuoteComponent } from "../../../../../services/modal/modal-quote/modal-quote.component";

/**
 * Password quotes header component
 */
@Component({
  selector: 'app-quote-create-header',
  templateUrl: './quote-create-header.component.html',
  styleUrls: ['./quote-create-header.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class QuoteCreateHeaderComponent {

  @Output() saveAndContinue = new EventEmitter<string>();
  @Output() approve = new EventEmitter<string>();
  @Output() toInvoice = new EventEmitter<string>();
  @Output() toTicket = new EventEmitter<string>();
  @Output() download = new EventEmitter<string>();


  @Input() editMode: boolean;


  /**
   * Creates an instance of the QuoteCreateHeaderComponent with the injected services
   * @param {NgbModal} modalService Service to work with modli
   * @param {QuoteStateService} quoteStateService to work quote state
   */
  constructor(
    private modalService: NgbModal,
    private quoteStateService: QuoteStateService,
    config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  /**
   * Emit save quotes to QuoteCreate component
   */
  public saveQuotes() {
    this.saveAndContinue.next();
  }

  /**
   * Emit approve quotes to QuoteCreate component
   */
  public approveQuote() {
    this.approve.next();
  }

  /**
   * Emit convert to invoice to QuoteCreate component
   */
  public convertToInvoice() {
    this.toInvoice.next();
  }

  /**
   * Emit convert to ticket to QuoteCreate component
   */
  public convertToTicket() {
    this.toTicket.next();
  }

  /**
   * Emit download pdf to QuoteCreate component
   */
  public downloadPdf() {
    this.download.next();
  }

  /**
   * go to quotes list
   */
  public returnToQuotes() {
    this.quoteStateService.goToQuote();
  }

  /**
   * go to quotes state
   */
  public goToState(state) {
    this.quoteStateService.goToState(state, { editMode: this.editMode });
  }

  /**
   * save quote and open send modal
   */
  public saveAndSend() {
    const modalRef = this.modalService.open(ModalQuoteComponent, this.quoteStateService.quoteForCreate);
    let data = JSON.parse(JSON.stringify(this.quoteStateService.quoteForCreate));
    let itemsArray = this.quoteStateService.getItemArray();
    data.products = this.quoteStateService.getProductsQuote(itemsArray);
    data.services = this.quoteStateService.getServicesQuote(itemsArray);
    modalRef.componentInstance.data = data;
  }

}
