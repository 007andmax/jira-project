import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DisabledBtnDirective } from 'src/ng2/app/directives/disabled-btn.directive';
import { ModalQuoteComponent } from 'src/ng2/app/services/modal/modal-quote/modal-quote.component';
import { QuoteService } from 'src/ng2/app/services/quote/quote.service';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
import { QuoteStateService } from 'src/ng2/app/states/quote/quote-state.service';
import { NotificationStateService } from '../../../shared/notification/services/notification-state.service';
import { QuoteAdd } from '../class/quote-add';
import { QuotePreview } from '../class/quote-preview';
import { QuoteValdiate } from '../class/quote-vildate';
import { QuoteAsideAddBodyComponent } from './quote-aside-add-body/quote-aside-add-body.component';

@Component({
  selector: 'app-quote-aside-add',
  templateUrl: './quote-aside-add.component.html',
  styleUrls: ['./quote-aside-add.component.scss']
})
export class QuoteAsideAddComponent implements OnInit {
  @ViewChild('saveAndSendBtn') saveAndSendBtn: DisabledBtnDirective;
  @ViewChild('saveAndContinueBtn') saveAndContinueBtn: DisabledBtnDirective;
  @ViewChild('saveAndApproveBtn') saveAndApproveBtn: DisabledBtnDirective;
  @ViewChild('saveAndDownloadBtn') saveAndDownloadBtn: DisabledBtnDirective;
  @ViewChild('quoteAdd') quoteAdd: QuoteAsideAddBodyComponent;
  validate: QuoteValdiate = new QuoteValdiate();
  showPreview: boolean = false;
  quotePreview: QuotePreview;
  open: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private quoteStateService: QuoteStateService,
    private billableStateService: BillableStateService,
    private notificationStateService: NotificationStateService,
    private modalService: NgbModal,
    private quoteService: QuoteService,) { }

  ngOnInit() {
    let getOnCreate = this.quoteStateService.getOnCreate().subscribe(quote => {
      this.open = true;
    })
    this.sub.add(getOnCreate);
    let getOnCopy = this.quoteStateService.getOnCopy().subscribe(quote => {
      this.open = true;
    })
    this.sub.add(getOnCopy);
    this.quoteStateService.getHandleSendMode().subscribe(data => {
      this.saveAndSendBtn.setDisabled(true);
      this.quoteService.createQuote(data, true).subscribe((res) => {
        this.saveAndSendBtn.setDisabled(false);
        this.close();
      }, err => {
        this.validate.setErrorMessage(err.error.validationResults.saleQuotePostDto);
        this.saveAndSendBtn.setDisabled(false);
      });
    });
  }
  close() {
    this.open = false;
    this.showPreview = false;
    this.billableStateService.setRegulatNote(null);
    this.validate = new QuoteValdiate();
    this.quoteStateService.resetQuoteForCopy();
  }
  saveAndSend() {

    let quote: QuoteAdd = this.quoteAdd.getQuote();
    if (!this.quoteAdd.getValidate().isValidate(quote)) return;
    const modalRef = this.modalService.open(ModalQuoteComponent, { windowClass: 'quote-send-modal' });
    let data = JSON.parse(JSON.stringify(quote.getDataForCreate(true)));
    modalRef.componentInstance.data = data;
  }
  saveAndDownload() {
    let quote: QuoteAdd = this.quoteAdd.getQuote();
    if (!this.quoteAdd.getValidate().isValidate(quote)) return;
    this.saveAndDownloadBtn.setDisabled(true);
    this.quoteService.createQuote(quote.getDataForCreate(false), false).subscribe((data: any) => {
      const id = data['id'];
      this.quoteService.downloadPdf(data['id']).subscribe((res) => {
        this.quoteService.downLoadFile(res, id, data.company.name, data.number);
        this.notificationStateService.oninitShowNotification('Quote has been saved');
        this.saveAndDownloadBtn.setDisabled(false);
        this.close();
      });
    }, err => {
      this.validate.setErrorMessage(err.error.validationResults.saleQuotePostDto);
      this.saveAndDownloadBtn.setDisabled(false);
    });
  }
  public saveAndContinue() {
    let quote: QuoteAdd = this.quoteAdd.getQuote();
    if (!this.quoteAdd.getValidate().isValidate(quote)) return;
    this.saveAndContinueBtn.setDisabled(true);
    this.quoteService.createQuote(quote.getDataForCreate(false), false).subscribe((data) => {
      this.saveAndContinueBtn.setDisabled(false);
      this.close();
    }, err => {
      this.validate.setErrorMessage(err.error.validationResults.saleQuotePostDto);
      this.saveAndContinueBtn.setDisabled(false);
    });
  }
  public saveAndApprove() {
    let quote: QuoteAdd = this.quoteAdd.getQuote();
    if (!this.quoteAdd.getValidate().isValidate(quote)) return;
    this.saveAndApproveBtn.setDisabled(true);
    this.quoteService.createQuote(quote.getDataForCreate(false), false)
      .subscribe((res) => {
        this.quoteService.approveQuote(res['company'], res['id'])
          .subscribe((res) => {
            this.saveAndApproveBtn.setDisabled(false);
            this.close();

          });
      }, err => {
        this.validate.setErrorMessage(err.error.validationResults.saleQuotePostDto);
        this.saveAndApproveBtn.setDisabled(false);
      });
  }

  onPreview() {

    this.quotePreview = new QuotePreview(this.quoteAdd.getQuotePreview());
    this.showPreview = true;
  }

}
