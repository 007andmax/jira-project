import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuotePreview } from '../class/quote-preview';
import * as moment from "moment";
import { QuoteService } from 'src/ng2/app/services/quote/quote.service';
import { ModalQuoteComponent } from 'src/ng2/app/services/modal/modal-quote/modal-quote.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { ARCHIVE_QUOTE } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { QuoteStateService } from 'src/ng2/app/states/quote/quote-state.service';

@Component({
  selector: 'app-quote-aside-preview',
  templateUrl: './quote-aside-preview.component.html',
  styleUrls: ['./quote-aside-preview.component.scss']
})
export class QuoteAsidePreviewComponent implements OnInit, OnDestroy {
  quote: QuotePreview;
  showPreloader: boolean = true;
  toggleQuoteMessage: boolean = true;
  toggleStatus: boolean = true;
  open: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private quoteStateService: QuoteStateService,
    private quoteServices: QuoteService,
    private modalService: NgbModal,
    private confirmStateService: ConfirmStateService) { }

  ngOnInit() {

    let getOnPreview = this.quoteStateService.getOnPreview().subscribe(quote => {
      this.open = true;
      this.quoteServices.getQuote(quote.id).subscribe((data) => {
        this.quote = new QuotePreview(data);
        this.open = true;
        this.showPreloader = false;
        console.log("this.quote", this.quote);

      })
    })
    this.sub.add(getOnPreview);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === ARCHIVE_QUOTE) this.onArchiveQuote();

      }
    })
    this.sub.add(getConfirm);
  }
  close() {
    this.open = false;
    this.showPreloader = true;
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  public checkStatus(quote, statusForShowingArray) {
    const elems = statusForShowingArray.filter((item) => item.toLowerCase() === quote.status.toLowerCase());
    return elems.length > 0;
  }
  editQuote() {
    this.close();
    this.quoteStateService.setEdit(this.quote);
  }
  downloadPdf() {
    this.quoteServices.downloadPdf(this.quote.id).subscribe((res) => this.quoteServices.downLoadFile(res, this.quote.id, this.quote.company.name, this.quote.number));
  }
  cancelQuote() {
    this.quoteServices.cancelQuote(this.quote.company, this.quote.id).subscribe((res) => {
      this.close();
    });
  }
  convertToInvoice() {
    this.quoteServices.convertToInvoice({ companyInfo: this.quote.company }, this.quote.id).subscribe((res) => {

    });
  }
  onArchiveQuote() {
    this.quoteServices.archiveQuote(this.quote.company, this.quote.id).subscribe((res) => {

    });
  }
  archiveQuote() {
    this.confirmStateService.setConfirmAction(ARCHIVE_QUOTE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to archive a quote?`;
  }
  
  public resend() {
    if (this.quote.status === 'TICKETED' || this.quote.status === 'INVOICED') {
      this.quoteServices.repeatSend(this.quote.id).subscribe();
    } else {
      let recipients = this.quote.recipients;
      //  if (typeof recipients === "string") this.quote.recipients = recipients.split(',');
     // this.quoteServices.getQuote(this.quote.id).subscribe((data) => {
        const modalRef = this.modalService.open(ModalQuoteComponent);
        modalRef.componentInstance.data = this.quote;
      //})
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
