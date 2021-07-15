import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { QUOTE_MODAL_ACTION_EDIT } from 'src/app/const/quote';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn.directive';
import { ModalQuoteComponent } from 'src/app/services/modal/modal-quote/modal-quote.component';
import { QuoteService } from 'src/app/services/quote/quote.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { QuoteEdit } from '../class/quote-edit';
import { QuotePreview } from '../class/quote-preview';
import { QuoteValdiateEdit } from '../class/quote-vildate-edit';
import { QuoteAsideEditBodyComponent } from './quote-aside-edit-body/quote-aside-edit-body.component';

@Component({
  selector: 'app-quote-aside-edit',
  templateUrl: './quote-aside-edit.component.html',
  styleUrls: ['./quote-aside-edit.component.scss']
})
export class QuoteAsideEditComponent implements OnInit, OnDestroy {
  @ViewChild('saveAndSendBtn') saveAndSendBtn: DisabledBtnDirective;
  @ViewChild('saveAndContinueBtn') saveAndContinueBtn: DisabledBtnDirective;
  @ViewChild('saveAndApproveBtn') saveAndApproveBtn: DisabledBtnDirective;
  @ViewChild('saveAndDownloadBtn') saveAndDownloadBtn: DisabledBtnDirective;
  @ViewChild('quoteEdit') quoteEdit: QuoteAsideEditBodyComponent;
  validate: QuoteValdiateEdit = new QuoteValdiateEdit();
  showPreloader: boolean = true;
  quotePreview: QuotePreview;
  open: boolean = false;
  showPreview: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private quoteStateService: QuoteStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private quoteService: QuoteService,) { }

  ngOnInit() {
    let getOnEdit = this.quoteStateService.getOnEdit().subscribe(quote => {
      this.open = true;
    })
    this.sub.add(getOnEdit);
    let getHandleSendModeEdit = this.quoteStateService.getHandleSendModeEdit().subscribe(data => {
      this.saveAndSendBtn.setDisabled(true);
      this.quoteService.editQuote(data).subscribe((res) => {
        this.quoteService.repeatSend(data.id).subscribe(sendRes => {
          this.saveAndSendBtn.setDisabled(false);
          this.close();
        })
      }, err => {
        this.validate.setErrorMessage(err.error.validationResults.saleQuotePostDto);
        this.saveAndSendBtn.setDisabled(false);
      });
    })
    this.sub.add(getHandleSendModeEdit);
  }
  getEditQuote() {
    return this.quoteEdit.getQuote();
  }
  close() {
    this.open = false;
    this.showPreview = false;
    this.showPreloader = true;
    this.quoteEdit.resetQuote();
  }
  saveAndSend() {
    let quote: QuoteEdit = this.quoteEdit.getQuote();
    if (!this.quoteEdit.getValidate().isValidate(quote)) return;
    const modalRef = this.modalService.open(ModalQuoteComponent, { windowClass: 'quote-send-modal' });
    let data = JSON.parse(JSON.stringify(quote.getDataForUpdate(true)));
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.action = QUOTE_MODAL_ACTION_EDIT;
  }
  saveAndDownload() {
    let quote: QuoteEdit = this.quoteEdit.getQuote();
    if (!this.quoteEdit.getValidate().isValidate(quote)) return;
    this.saveAndDownloadBtn.setDisabled(true);
    this.quoteService.editQuote(quote.getDataForUpdate(false)).subscribe((data: any) => {
      const id = data['id'];
      this.quoteService.downloadPdf(data['id']).subscribe((res) => {
        this.quoteService.downLoadFile(res, id, data.company.name, data.number);
        this.saveAndDownloadBtn.setDisabled(false);
        this.close();
      });
    }, err => {
      this.validate.setErrorMessage(err.error.validationResults.saleQuotePostDto);
      this.saveAndDownloadBtn.setDisabled(false);
    });
  }
  public saveAndContinue() {
    let quote: QuoteEdit = this.quoteEdit.getQuote();
    if (!this.quoteEdit.getValidate().isValidate(quote)) return;
    this.saveAndContinueBtn.setDisabled(true);
    this.quoteService.editQuote(quote.getDataForUpdate(false)).subscribe((data) => {
      this.saveAndContinueBtn.setDisabled(false);
      this.close();
    }, err => {
      this.validate.setErrorMessage(err.error.validationResults.saleQuotePostDto);
      this.saveAndContinueBtn.setDisabled(false);
    });
  }
  public saveAndApprove() {
    let quote: QuoteEdit = this.quoteEdit.getQuote();
    if (!this.quoteEdit.getValidate().isValidate(quote)) return;
    this.saveAndApproveBtn.setDisabled(true);
    this.quoteService.editQuote(quote.getDataForUpdate(false))
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
    this.quotePreview = new QuotePreview(this.quoteEdit.getQuotePreview());
    this.showPreview = true;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
